import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useCurrency } from '@/context/CurrencyContext';

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { formatAmount } = useCurrency();

  const pendingPayments = [
    {
      id: 1,
      title: 'Tuition Fee - Term 2',
      amount: 450.00,
      dueDate: 'Oct 30, 2023',
      status: 'pending',
      child: 'Alex Johnson',
    },
    {
      id: 2,
      title: 'Lab Fee',
      amount: 75.00,
      dueDate: 'Nov 5, 2023',
      status: 'pending',
      child: 'Alex Johnson',
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      title: 'Tuition Fee - Term 1',
      amount: 450.00,
      paidDate: 'Aug 15, 2023',
      status: 'paid',
      method: 'Credit Card',
    },
    {
      id: 2,
      title: 'Registration Fee',
      amount: 100.00,
      paidDate: 'Jul 20, 2023',
      status: 'paid',
      method: 'Bank Transfer',
    },
    {
      id: 3,
      title: 'Books & Materials',
      amount: 200.00,
      paidDate: 'Jul 15, 2023',
      status: 'paid',
      method: 'Credit Card',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Due</Text>
            <Text style={styles.summaryAmount}>{formatAmount(525)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>This Month</Text>
            <Text style={[styles.summaryAmount, { color: '#DC2626' }]}>{formatAmount(450)}</Text>
          </View>
        </View>

        {/* Pending Payments */}
        <Text style={styles.sectionTitle}>Pending Payments</Text>
        <View style={styles.paymentsList}>
          {pendingPayments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentIconContainer}>
                  <Ionicons name="document-text-outline" size={22} color="#8B5CF6" />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>{payment.title}</Text>
                  <Text style={styles.paymentChild}>For: {payment.child}</Text>
                </View>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Due</Text>
                </View>
              </View>
              <View style={styles.paymentDetails}>
                <View>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.paymentAmount}>{formatAmount(payment.amount)}</Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>Due Date</Text>
                  <Text style={styles.dueDate}>{payment.dueDate}</Text>
                </View>
                <TouchableOpacity
                  style={styles.payNowButton}
                  onPress={() => router.push('/parent/fees')}
                >
                  <Text style={styles.payNowText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Payment History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Download All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {paymentHistory.map((payment) => (
            <View key={payment.id} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{payment.title}</Text>
                <Text style={styles.historyDate}>{payment.paidDate} • {payment.method}</Text>
              </View>
              <Text style={styles.historyAmount}>{formatAmount(payment.amount)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  paymentsList: {
    gap: 16,
    marginBottom: 24,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  paymentChild: {
    fontSize: 13,
    color: '#6B7280',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  paymentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dueDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  payNowButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  payNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
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
  historyIcon: {
    marginRight: 14,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
});
