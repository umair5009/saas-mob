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
import { useAuth, getChildrenData } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';
import CircularProgress from '@/components/CircularProgress';

const { width } = Dimensions.get('window');

export default function ParentDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const { theme, isDark } = useTheme();

  // Get children data from AuthContext
  const childrenIds = user?.children || [];
  const children = getChildrenData(childrenIds);

  // Calculate total pending fees (in USD - will be converted by formatAmount)
  const totalPendingFees = 450 * children.length;

  const recentActivities = [
    {
      id: 1,
      type: 'grade',
      title: 'New Grade Posted',
      description: 'Alex received A in Mathematics Quiz',
      time: '2 hours ago',
      icon: 'school',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'Emma was present today',
      time: '5 hours ago',
      icon: 'checkmark-circle',
      iconBg: '#D1FAE5',
      iconColor: '#059669',
    },
    {
      id: 3,
      type: 'fee',
      title: 'Fee Reminder',
      description: 'Tuition fee due by Oct 30',
      time: '1 day ago',
      icon: 'warning',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      id: 4,
      type: 'event',
      title: 'Upcoming Event',
      description: 'Parent-Teacher Meeting on Nov 5',
      time: '2 days ago',
      icon: 'calendar',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
    },
  ];

  const quickActions = [
    { icon: 'calendar', label: 'Schedule', color: '#E0F2FE', iconColor: '#0284C7' },
    { icon: 'chatbubbles', label: 'Messages', color: '#F3E8FF', iconColor: '#9333EA' },
    { icon: 'document-text', label: 'Reports', color: '#FEE2E2', iconColor: '#DC2626' },
    { icon: 'card', label: 'Pay Fees', color: '#D1FAE5', iconColor: '#059669' },
  ];

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return '#22C55E';
    if (attendance >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusText = (attendance: number) => {
    if (attendance >= 90) return 'Excellent';
    if (attendance >= 75) return 'Good';
    return 'Needs Attention';
  };

  const getStatusColor = (attendance: number) => {
    if (attendance >= 90) return { bg: '#D1FAE5', text: '#059669' };
    if (attendance >= 75) return { bg: '#FEF3C7', text: '#D97706' };
    return { bg: '#FEE2E2', text: '#DC2626' };
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeLabel, { color: theme.textSecondary }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Parent'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => router.push('/parent/notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={theme.text} />
              <View style={[styles.notificationDot, { backgroundColor: theme.error }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => router.push('/parent/profile')}
            >
              <View style={[styles.avatar, { backgroundColor: theme.backgroundTertiary, borderColor: theme.secondaryLight }]}>
                <Ionicons name="person" size={24} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Children Overview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>My Children ({children.length})</Text>
          <TouchableOpacity onPress={() => router.push('/parent/children')}>
            <Text style={[styles.seeAll, { color: theme.secondary }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Children Cards - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.childrenScrollContainer}
        >
          {children.map((child) => {
            const statusColor = getStatusColor(child.attendance || 0);
            return (
              <TouchableOpacity
                key={child.id}
                style={[styles.childCard, { backgroundColor: theme.card }]}
                activeOpacity={0.7}
                onPress={() => router.push('/parent/children')}
              >
                <View style={styles.childHeader}>
                  <View style={[styles.childAvatar, { backgroundColor: theme.secondaryLight }]}>
                    <Ionicons name="person" size={24} color={theme.secondary} />
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={[styles.childName, { color: theme.text }]}>{child.name}</Text>
                    <Text style={[styles.childClass, { color: theme.textSecondary }]}>Class {child.class}</Text>
                  </View>
                </View>

                <View style={[styles.childStatsRow, { borderTopColor: theme.borderLight }]}>
                  <View style={styles.miniStatItem}>
                    <CircularProgress
                      percentage={child.attendance || 0}
                      size={50}
                      strokeWidth={5}
                      progressColor={getAttendanceColor(child.attendance || 0)}
                      bgColor={isDark ? theme.backgroundTertiary : '#E5E7EB'}
                      textColor={theme.text}
                    />
                    <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>Attendance</Text>
                  </View>
                  <View style={styles.miniStatItem}>
                    <View style={[styles.miniGpaContainer, { backgroundColor: theme.primaryLight }]}>
                      <Text style={[styles.miniGpaValue, { color: theme.primary }]}>{child.gpa || 0}</Text>
                    </View>
                    <Text style={[styles.miniStatLabel, { color: theme.textSecondary }]}>GPA</Text>
                  </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: isDark ? theme.backgroundTertiary : statusColor.bg }]}>
                  <Ionicons
                    name={child.attendance && child.attendance >= 75 ? 'checkmark-circle' : 'alert-circle'}
                    size={14}
                    color={statusColor.text}
                  />
                  <Text style={[styles.statusText, { color: statusColor.text }]}>
                    {getStatusText(child.attendance || 0)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Fee Alert */}
        <View style={[styles.feeCard, { backgroundColor: theme.card, borderLeftColor: theme.secondary }]}>
          <View style={styles.feeContent}>
            <View style={[styles.feeIconContainer, { backgroundColor: theme.secondaryLight }]}>
              <Ionicons name="wallet-outline" size={24} color={theme.secondary} />
            </View>
            <View style={styles.feeInfo}>
              <Text style={[styles.feeTitle, { color: theme.textSecondary }]}>Total Pending Payment</Text>
              <Text style={[styles.feeAmount, { color: theme.text }]}>{formatAmount(totalPendingFees)}</Text>
              <Text style={[styles.feeDue, { color: theme.textTertiary }]}>For {children.length} children • Due by Oct 30</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.payButton, { backgroundColor: theme.secondary }]}
            onPress={() => router.push('/parent/fees')}
          >
            <Ionicons name="card-outline" size={18} color="#FFFFFF" />
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: theme.text, paddingHorizontal: 20 }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: isDark ? theme.backgroundTertiary : action.color }]}>
                <Ionicons name={action.icon as any} size={24} color={isDark ? theme.secondary : action.iconColor} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.secondary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={[styles.activityItem, { backgroundColor: theme.card }]}>
              <View style={[styles.activityIcon, { backgroundColor: isDark ? theme.backgroundTertiary : activity.iconBg }]}>
                <Ionicons name={activity.icon as any} size={20} color={isDark ? theme.secondary : activity.iconColor} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: theme.text }]}>{activity.title}</Text>
                <Text style={[styles.activityDescription, { color: theme.textSecondary }]}>{activity.description}</Text>
              </View>
              <Text style={[styles.activityTime, { color: theme.textTertiary }]}>{activity.time}</Text>
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  welcomeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatarContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F3E8FF',
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
    paddingHorizontal: 20,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  childrenScrollContainer: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 8,
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  childClass: {
    fontSize: 13,
    color: '#6B7280',
  },
  childStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  miniStatItem: {
    alignItems: 'center',
  },
  miniStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
  },
  miniGpaContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniGpaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  feeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  feeInfo: {
    flex: 1,
  },
  feeTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  feeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  feeDue: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  payButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  quickActionItem: {
    width: (width - 72) / 4,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  activityItem: {
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
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
