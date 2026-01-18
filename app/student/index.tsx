import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CircularProgress from '@/components/CircularProgress';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function StudentDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  const quickActions = [
    { icon: 'calendar', label: 'Timetable', color: '#E0F2FE', iconColor: '#0284C7' },
    { icon: 'bar-chart', label: 'Results', color: '#FEE2E2', iconColor: '#DC2626' },
    { icon: 'book', label: 'Homework', color: '#FEF3C7', iconColor: '#D97706' },
    { icon: 'library', label: 'Library', color: '#DBEAFE', iconColor: '#2563EB' },
  ];

  const upcomingExams = [
    {
      id: 1,
      subject: 'Mathematics',
      chapter: 'Chapter 5 - 12',
      date: 'Oct 24, 2023',
      time: '09:00 AM - 11:00 AM',
      room: 'Room 302',
      type: 'Finals',
      icon: 'calculator',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
    },
    {
      id: 2,
      subject: 'Physics',
      chapter: 'Thermodynamics',
      date: 'Oct 26, 2023',
      time: '09:00 AM - 11:00 AM',
      room: 'Science Lab',
      type: 'Mid-term',
      icon: 'flask',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.classLabel, { color: theme.textSecondary }]}>Class 10-B</Text>
            <Text style={[styles.greeting, { color: theme.text }]}>Hello, Alex</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={() => router.push('/student/notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={theme.text} />
              <View style={[styles.notificationDot, { backgroundColor: theme.error }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => router.push('/student/profile')}
            >
              <View style={[styles.avatar, { backgroundColor: theme.backgroundTertiary, borderColor: theme.successLight }]}>
                <Ionicons name="person" size={24} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fee Alert Card */}
        <View style={[styles.feeCard, { backgroundColor: theme.card, borderLeftColor: theme.warning }]}>
          <View style={styles.feeHeader}>
            <Ionicons name="warning" size={20} color={theme.warning} />
            <Text style={[styles.feeTitle, { color: theme.text }]}>Tuition Fee Due</Text>
          </View>
          <Text style={[styles.feeDescription, { color: theme.textSecondary }]}>
            You have a pending payment of <Text style={[styles.feeAmount, { color: theme.text }]}>$450.00</Text> due by Oct 30.
          </Text>
          <TouchableOpacity style={[styles.payButton, { backgroundColor: theme.success }]}>
            <Ionicons name="card-outline" size={18} color="#FFFFFF" />
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Card */}
        <TouchableOpacity
          style={[styles.attendanceCard, { backgroundColor: theme.card }]}
          onPress={() => router.push('/student/attendance')}
          activeOpacity={0.7}
        >
          <View style={styles.attendanceLeft}>
            <Text style={[styles.attendanceTitle, { color: theme.text }]}>Attendance</Text>
            <Text style={[styles.attendanceSubtitle, { color: theme.textSecondary }]}>Overall performance</Text>
            <View style={[styles.statusBadge, { backgroundColor: theme.successLight }]}>
              <Text style={[styles.statusText, { color: theme.successDark }]}>Good Standing</Text>
            </View>
            <Text style={[styles.daysPresent, { color: theme.textTertiary }]}>102/120 Days Present</Text>
          </View>
          <CircularProgress percentage={85} size={90} strokeWidth={10} color={theme.primary} bgColor={isDark ? theme.backgroundTertiary : '#E5E7EB'} textColor={theme.text} />
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <View style={[styles.statIconBg, { backgroundColor: theme.secondaryLight }]}>
              <Ionicons name="school-outline" size={24} color={theme.secondary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>3.8</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current GPA</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <View style={[styles.statIconBg, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="clipboard-outline" size={24} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Assignments</Text>
          </View>
        </View>

        {/* Upcoming Exams */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Exams</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.examsContainer}
        >
          {upcomingExams.map((exam) => (
            <View key={exam.id} style={[styles.examCard, { backgroundColor: theme.card }]}>
              <View style={styles.examHeader}>
                <View style={[styles.examIconBg, { backgroundColor: isDark ? theme.backgroundTertiary : exam.iconBg }]}>
                  <Ionicons name={exam.icon as any} size={20} color={isDark ? theme.primary : exam.iconColor} />
                </View>
                <View style={[styles.examTypeBadge, { backgroundColor: theme.backgroundTertiary }]}>
                  <Text style={[styles.examTypeText, { color: theme.text }]}>{exam.type}</Text>
                </View>
              </View>
              <Text style={[styles.examSubject, { color: theme.text }]}>{exam.subject}</Text>
              <Text style={[styles.examChapter, { color: theme.textSecondary }]}>{exam.chapter}</Text>
              <View style={[styles.examDivider, { backgroundColor: theme.borderLight }]} />
              <View style={styles.examDetail}>
                <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.examDetailText, { color: theme.textSecondary }]}>{exam.date}</Text>
              </View>
              <View style={styles.examDetail}>
                <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.examDetailText, { color: theme.textSecondary }]}>{exam.time}</Text>
              </View>
              <View style={styles.examDetail}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.examDetailText, { color: theme.textSecondary }]}>{exam.room}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickActionItem}>
              <View style={[styles.quickActionIcon, { backgroundColor: isDark ? theme.backgroundTertiary : action.color }]}>
                <Ionicons name={action.icon as any} size={24} color={isDark ? theme.primary : action.iconColor} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>{action.label}</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  classLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  greeting: {
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
    borderColor: '#D1FAE5',
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  feeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  feeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  feeAmount: {
    fontWeight: '700',
    color: '#1F2937',
  },
  payButton: {
    backgroundColor: '#22C55E',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  attendanceLeft: {
    flex: 1,
  },
  attendanceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  attendanceSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  daysPresent: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  examsContainer: {
    paddingRight: 20,
    gap: 12,
    marginBottom: 24,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  examIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examTypeBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  examTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  examSubject: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  examChapter: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  examDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  examDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  examDetailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 16,
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
});
