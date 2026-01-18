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

const { width } = Dimensions.get('window');

export default function AttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(10);

  // Monthly trends data
  const monthlyTrends = [
    { month: 'Apr', value: 65 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 45 },
    { month: 'Jul', value: 25 },
    { month: 'Aug', value: 95 },
    { month: 'Sep', value: 75 },
  ];

  // Calendar data for September
  const calendarDays = [
    { day: null, status: null }, // Empty spaces for alignment
    { day: null, status: null },
    { day: 1, status: 'present' },
    { day: 2, status: 'present' },
    { day: 3, status: 'absent' },
    { day: 4, status: 'present' },
    { day: 5, status: 'present' },
    { day: 6, status: 'present' },
    { day: 7, status: null }, // Weekend
    { day: 8, status: 'present' },
    { day: 9, status: 'late' },
    { day: 10, status: 'present' },
    { day: 11, status: 'present' },
    { day: 12, status: 'absent' },
    { day: 13, status: 'present' },
    { day: 14, status: null }, // Weekend
  ];

  // Daily log for selected date
  const dailyLog = [
    {
      subject: 'Mathematics',
      time: '08:30 AM - 09:15 AM',
      status: 'present',
      icon: 'grid',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      subject: 'Physics',
      time: '09:20 AM - 10:05 AM',
      status: 'present',
      icon: 'flask',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
    },
    {
      subject: 'English Literature',
      time: '10:20 AM - 11:05 AM',
      status: 'absent',
      icon: 'book',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
    },
  ];

  const getStatusDotColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return '#22C55E';
      case 'absent':
        return '#EF4444';
      case 'late':
        return '#F59E0B';
      default:
        return 'transparent';
    }
  };

  const maxBarHeight = 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Summary</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Period Selector */}
        <TouchableOpacity style={styles.periodSelector}>
          <View style={styles.periodIcon}>
            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.periodInfo}>
            <Text style={styles.periodLabel}>Current Period</Text>
            <Text style={styles.periodValue}>September 2023</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Stats Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <View style={[styles.statCard, styles.presentCard]}>
            <View style={styles.statDot}>
              <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
            </View>
            <Text style={[styles.statLabel, { color: '#059669' }]}>Present</Text>
            <Text style={[styles.statNumber, { color: '#059669' }]}>22</Text>
            <Text style={[styles.statPercent, { color: '#059669' }]}>90% of days</Text>
          </View>

          <View style={[styles.statCard, styles.absentCard]}>
            <View style={styles.statDot}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            </View>
            <Text style={[styles.statLabel, { color: '#DC2626' }]}>Absent</Text>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>2</Text>
            <Text style={[styles.statPercent, { color: '#DC2626' }]}>8% of days</Text>
          </View>

          <View style={[styles.statCard, styles.leaveCard]}>
            <View style={styles.statDot}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={[styles.statLabel, { color: '#D97706' }]}>Leave</Text>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>1</Text>
            <Text style={[styles.statPercent, { color: '#D97706' }]}>2% of days</Text>
          </View>
        </ScrollView>

        {/* Monthly Trends */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <TouchableOpacity>
            <Text style={styles.viewReport}>View Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trendsCard}>
          <View style={styles.trendsHeader}>
            <Text style={styles.trendsPercent}>92%</Text>
            <Text style={styles.trendsLabel}>Average Attendance</Text>
          </View>
          <View style={styles.chartContainer}>
            {monthlyTrends.map((item, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.value / 100) * maxBarHeight,
                        backgroundColor: item.month === 'Aug' ? '#3B82F6' : '#DBEAFE',
                      },
                    ]}
                  />
                </View>
                <Text style={[
                  styles.barLabel,
                  item.month === 'Aug' && styles.barLabelActive
                ]}>
                  {item.month}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calendar View */}
        <Text style={styles.sectionTitle}>Calendar View</Text>
        <View style={styles.calendarCard}>
          {/* Week Days Header */}
          <View style={styles.weekDaysRow}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
              <Text key={index} style={styles.weekDayLabel}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  item.day === selectedDate && styles.calendarDaySelected,
                  !item.day && styles.calendarDayEmpty,
                ]}
                onPress={() => item.day && setSelectedDate(item.day)}
                disabled={!item.day}
              >
                {item.day && (
                  <>
                    <Text style={[
                      styles.calendarDayText,
                      item.day === selectedDate && styles.calendarDayTextSelected,
                      !item.status && styles.calendarDayTextMuted,
                    ]}>
                      {item.day}
                    </Text>
                    {item.status && (
                      <View style={[
                        styles.calendarDot,
                        { backgroundColor: getStatusDotColor(item.status) }
                      ]} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Log */}
        <Text style={styles.sectionTitle}>Daily Log: Sep {selectedDate}</Text>
        <View style={styles.dailyLogList}>
          {dailyLog.map((item, index) => (
            <View key={index} style={styles.logItem}>
              <View style={[styles.logIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
              </View>
              <View style={styles.logContent}>
                <Text style={styles.logSubject}>{item.subject}</Text>
                <Text style={styles.logTime}>{item.time}</Text>
              </View>
              <View style={[
                styles.logStatus,
                {
                  backgroundColor: item.status === 'present' ? '#D1FAE5' : '#FEE2E2',
                }
              ]}>
                <Text style={[
                  styles.logStatusText,
                  { color: item.status === 'present' ? '#059669' : '#DC2626' }
                ]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  periodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  periodInfo: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  periodValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    width: 130,
    marginRight: 12,
  },
  presentCard: {
    backgroundColor: '#D1FAE5',
  },
  absentCard: {
    backgroundColor: '#FEE2E2',
  },
  leaveCard: {
    backgroundColor: '#FEF3C7',
  },
  statDot: {
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statPercent: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  viewReport: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  trendsPercent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 12,
  },
  trendsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 100,
    justifyContent: 'flex-end',
    width: 30,
  },
  bar: {
    width: 30,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  barLabelActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: (width - 72) / 7,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - 72) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDaySelected: {
    backgroundColor: '#3B82F6',
    borderRadius: 22,
  },
  calendarDayEmpty: {},
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
  },
  calendarDayTextMuted: {
    color: '#D1D5DB',
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  dailyLogList: {
    gap: 12,
  },
  logItem: {
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
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logContent: {
    flex: 1,
  },
  logSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  logTime: {
    fontSize: 13,
    color: '#6B7280',
  },
  logStatus: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
