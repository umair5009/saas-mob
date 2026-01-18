import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuth, getChildrenData } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

const { width } = Dimensions.get('window');

interface FeeItem {
  id: string;
  type: 'tuition' | 'transport' | 'library' | 'exam' | 'sports' | 'lab';
  title: string;
  amount: number;
  dueDate: string;
  status: 'overdue' | 'due_soon' | 'upcoming' | 'paid';
  description?: string;
}

export default function FeesOverviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { formatAmount } = useCurrency();

  // Get children data
  const childrenIds = user?.children || [];
  const children = getChildrenData(childrenIds);

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedFees, setSelectedFees] = useState<string[]>(['1', '2']);

  // Fee data for each child (would come from API in real app)
  const getFeeData = (childId: string): FeeItem[] => {
    const baseFees: FeeItem[] = [
      {
        id: '1',
        type: 'tuition',
        title: 'Tuition Fee',
        amount: 800.00,
        dueDate: 'Oct 15',
        status: 'overdue',
        description: 'Term 2 Tuition Fee',
      },
      {
        id: '2',
        type: 'transport',
        title: 'Bus Transport - Nov',
        amount: 150.00,
        dueDate: 'Nov 01',
        status: 'due_soon',
        description: 'Monthly transportation',
      },
      {
        id: '3',
        type: 'library',
        title: 'Library Fine',
        amount: 15.00,
        dueDate: 'Nov 05',
        status: 'upcoming',
        description: 'Late return penalty',
      },
    ];

    // Vary amounts slightly per child for demo
    if (childId === 'STU002') {
      return baseFees.map(fee => ({
        ...fee,
        amount: fee.amount * 0.9,
      }));
    }
    if (childId === 'STU003') {
      return baseFees.map(fee => ({
        ...fee,
        amount: fee.amount * 0.8,
      }));
    }
    return baseFees;
  };

  const paymentHistory: FeeItem[] = [
    {
      id: 'h1',
      type: 'tuition',
      title: 'Tuition Fee - Term 1',
      amount: 800.00,
      dueDate: 'Sep 15',
      status: 'paid',
    },
    {
      id: 'h2',
      type: 'transport',
      title: 'Bus Transport - Oct',
      amount: 150.00,
      dueDate: 'Oct 01',
      status: 'paid',
    },
  ];

  const selectedChild = children[selectedChildIndex];
  const fees = selectedChild ? getFeeData(selectedChild.id) : [];
  const pendingFees = fees.filter(f => f.status !== 'paid');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'overdue':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Overdue' };
      case 'due_soon':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Due Soon' };
      case 'upcoming':
        return { bg: '#DBEAFE', text: '#2563EB', label: 'Upcoming' };
      case 'paid':
        return { bg: '#D1FAE5', text: '#059669', label: 'Paid' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', label: 'Unknown' };
    }
  };

  const getFeeIcon = (type: string) => {
    switch (type) {
      case 'tuition':
        return 'school';
      case 'transport':
        return 'bus';
      case 'library':
        return 'book';
      case 'exam':
        return 'document-text';
      case 'sports':
        return 'football';
      case 'lab':
        return 'flask';
      default:
        return 'receipt';
    }
  };

  const getFeeIconBg = (type: string) => {
    switch (type) {
      case 'tuition':
        return '#DBEAFE';
      case 'transport':
        return '#FEF3C7';
      case 'library':
        return '#F3E8FF';
      case 'exam':
        return '#FEE2E2';
      case 'sports':
        return '#D1FAE5';
      case 'lab':
        return '#E0E7FF';
      default:
        return '#F3F4F6';
    }
  };

  const getFeeIconColor = (type: string) => {
    switch (type) {
      case 'tuition':
        return '#2563EB';
      case 'transport':
        return '#D97706';
      case 'library':
        return '#9333EA';
      case 'exam':
        return '#DC2626';
      case 'sports':
        return '#059669';
      case 'lab':
        return '#4F46E5';
      default:
        return '#6B7280';
    }
  };

  const toggleFeeSelection = (feeId: string) => {
    setSelectedFees(prev =>
      prev.includes(feeId)
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const totalSelected = pendingFees
    .filter(fee => selectedFees.includes(fee.id))
    .reduce((sum, fee) => sum + fee.amount, 0);

  const totalOutstanding = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);

  const getNextDueDate = () => {
    const overdueFees = pendingFees.filter(f => f.status === 'overdue');
    if (overdueFees.length > 0) return overdueFees[0].dueDate;
    const dueSoonFees = pendingFees.filter(f => f.status === 'due_soon');
    if (dueSoonFees.length > 0) return dueSoonFees[0].dueDate;
    return pendingFees[0]?.dueDate || 'N/A';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fee Overview</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Child Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.childSelectorContainer}
      >
        {children.map((child, index) => (
          <TouchableOpacity
            key={child.id}
            style={[
              styles.childTab,
              selectedChildIndex === index && styles.childTabActive,
            ]}
            onPress={() => {
              setSelectedChildIndex(index);
              setSelectedFees(['1', '2']); // Reset selection when switching child
            }}
          >
            <View style={[
              styles.childTabAvatar,
              selectedChildIndex === index && styles.childTabAvatarActive,
            ]}>
              <Ionicons
                name="person"
                size={18}
                color={selectedChildIndex === index ? '#FFFFFF' : '#8B5CF6'}
              />
            </View>
            <View>
              <Text style={[
                styles.childTabName,
                selectedChildIndex === index && styles.childTabNameActive,
              ]}>
                {child.name.split(' ')[0]}
              </Text>
              <Text style={[
                styles.childTabClass,
                selectedChildIndex === index && styles.childTabClassActive,
              ]}>
                Class {child.class}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.outstandingCard]}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="wallet-outline" size={22} color="#DC2626" />
            </View>
            <Text style={styles.summaryLabel}>Total Outstanding</Text>
            <Text style={styles.summaryAmount}>{formatAmount(totalOutstanding)}</Text>
          </View>
          <View style={[styles.summaryCard, styles.dueDateCard]}>
            <View style={[styles.summaryIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="calendar-outline" size={22} color="#D97706" />
            </View>
            <Text style={styles.summaryLabel}>Next Due Date</Text>
            <Text style={[styles.summaryAmount, { color: '#D97706' }]}>{getNextDueDate()}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
              Pending Fees
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              Payment History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fee List */}
        <View style={styles.feeList}>
          {activeTab === 'pending' ? (
            pendingFees.map((fee) => {
              const status = getStatusStyle(fee.status);
              const isSelected = selectedFees.includes(fee.id);
              return (
                <TouchableOpacity
                  key={fee.id}
                  style={[styles.feeCard, isSelected && styles.feeCardSelected]}
                  onPress={() => toggleFeeSelection(fee.id)}
                  activeOpacity={0.7}
                >
                  {/* Checkbox */}
                  <TouchableOpacity
                    style={[styles.checkbox, isSelected && styles.checkboxChecked]}
                    onPress={() => toggleFeeSelection(fee.id)}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>

                  {/* Icon */}
                  <View style={[styles.feeIcon, { backgroundColor: getFeeIconBg(fee.type) }]}>
                    <Ionicons
                      name={getFeeIcon(fee.type) as any}
                      size={22}
                      color={getFeeIconColor(fee.type)}
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.feeContent}>
                    <View style={styles.feeHeader}>
                      <Text style={styles.feeTitle}>{fee.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.text }]}>
                          {status.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.feeDueDate}>Due: {fee.dueDate}</Text>
                  </View>

                  {/* Amount */}
                  <Text style={styles.feeAmount}>{formatAmount(fee.amount)}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            paymentHistory.map((fee) => {
              const status = getStatusStyle(fee.status);
              return (
                <View key={fee.id} style={styles.feeCard}>
                  {/* Icon */}
                  <View style={[styles.feeIcon, { backgroundColor: getFeeIconBg(fee.type) }]}>
                    <Ionicons
                      name={getFeeIcon(fee.type) as any}
                      size={22}
                      color={getFeeIconColor(fee.type)}
                    />
                  </View>

                  {/* Content */}
                  <View style={[styles.feeContent, { marginLeft: 0 }]}>
                    <View style={styles.feeHeader}>
                      <Text style={styles.feeTitle}>{fee.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.text }]}>
                          {status.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.feeDueDate}>Paid: {fee.dueDate}</Text>
                  </View>

                  {/* Amount */}
                  <Text style={[styles.feeAmount, { color: '#059669' }]}>
                    {formatAmount(fee.amount)}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar - Only show for pending fees */}
      {activeTab === 'pending' && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Selected</Text>
            <Text style={styles.totalAmount}>{formatAmount(totalSelected)}</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetailsLink}>View Details</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.payButton,
              selectedFees.length === 0 && styles.payButtonDisabled,
            ]}
            disabled={selectedFees.length === 0}
          >
            <Ionicons name="card-outline" size={20} color="#FFFFFF" />
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  moreButton: {
    padding: 4,
  },
  childSelectorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  childTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    gap: 10,
    marginRight: 12,
  },
  childTabActive: {
    backgroundColor: '#8B5CF6',
  },
  childTabAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childTabAvatarActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  childTabName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  childTabNameActive: {
    color: '#FFFFFF',
  },
  childTabClass: {
    fontSize: 11,
    color: '#6B7280',
  },
  childTabClassActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 180,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outstandingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  dueDateCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
  },
  summaryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#8B5CF6',
  },
  feeList: {
    gap: 12,
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feeCardSelected: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  feeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  feeContent: {
    flex: 1,
  },
  feeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  feeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  feeDueDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewDetailsLink: {
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 2,
  },
  payButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
