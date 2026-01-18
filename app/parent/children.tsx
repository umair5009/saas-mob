import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import CircularProgress from '@/components/CircularProgress';
import { useAuth, getChildrenData } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

const { width } = Dimensions.get('window');

export default function ChildrenScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { formatAmount } = useCurrency();

  // Get children data from AuthContext
  const childrenIds = user?.children || [];
  const children = getChildrenData(childrenIds);

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const selectedChild = children[selectedChildIndex];

  // Mock additional data per child (would come from API in real app)
  const getChildExtras = (childId: string) => {
    const extras: Record<string, { pendingAssignments: number; upcomingExams: number; subjects: string[] }> = {
      'STU001': { pendingAssignments: 3, upcomingExams: 2, subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'] },
      'STU002': { pendingAssignments: 2, upcomingExams: 1, subjects: ['Mathematics', 'Science', 'English', 'History'] },
      'STU003': { pendingAssignments: 4, upcomingExams: 3, subjects: ['Mathematics', 'Science', 'English', 'Art'] },
    };
    return extras[childId] || { pendingAssignments: 0, upcomingExams: 0, subjects: [] };
  };

  // Mock grades data per child
  const getRecentGrades = (childId: string) => {
    const gradesData: Record<string, Array<{ subject: string; grade: string; score: string; date: string }>> = {
      'STU001': [
        { subject: 'Mathematics', grade: 'A', score: '92/100', date: 'Oct 15' },
        { subject: 'Physics', grade: 'A-', score: '88/100', date: 'Oct 14' },
        { subject: 'English', grade: 'B+', score: '85/100', date: 'Oct 12' },
        { subject: 'Chemistry', grade: 'A', score: '90/100', date: 'Oct 10' },
      ],
      'STU002': [
        { subject: 'Mathematics', grade: 'A-', score: '89/100', date: 'Oct 15' },
        { subject: 'Science', grade: 'A', score: '94/100', date: 'Oct 13' },
        { subject: 'English', grade: 'A', score: '91/100', date: 'Oct 11' },
        { subject: 'History', grade: 'B+', score: '86/100', date: 'Oct 09' },
      ],
      'STU003': [
        { subject: 'Mathematics', grade: 'B+', score: '84/100', date: 'Oct 14' },
        { subject: 'Science', grade: 'B', score: '80/100', date: 'Oct 12' },
        { subject: 'English', grade: 'A-', score: '87/100', date: 'Oct 10' },
        { subject: 'Art', grade: 'A', score: '95/100', date: 'Oct 08' },
      ],
    };
    return gradesData[childId] || [];
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return '#22C55E';
    if (attendance >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusText = (attendance: number) => {
    if (attendance >= 90) return 'Excellent Attendance';
    if (attendance >= 75) return 'Good Standing';
    return 'Needs Improvement';
  };

  const getStatusStyle = (attendance: number) => {
    if (attendance >= 90) return { bg: '#D1FAE5', text: '#059669' };
    if (attendance >= 75) return { bg: '#FEF3C7', text: '#D97706' };
    return { bg: '#FEE2E2', text: '#DC2626' };
  };

  if (!selectedChild) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Children</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No children linked to your account</Text>
        </View>
      </View>
    );
  }

  const childExtras = getChildExtras(selectedChild.id);
  const recentGrades = getRecentGrades(selectedChild.id);
  const statusStyle = getStatusStyle(selectedChild.attendance || 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Children</Text>
        <Text style={styles.childCount}>{children.length} {children.length === 1 ? 'child' : 'children'}</Text>
      </View>

      {/* Child Selector Tabs */}
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
            onPress={() => setSelectedChildIndex(index)}
          >
            <View style={[
              styles.childTabAvatar,
              selectedChildIndex === index && styles.childTabAvatarActive,
            ]}>
              <Ionicons
                name="person"
                size={20}
                color={selectedChildIndex === index ? '#FFFFFF' : '#8B5CF6'}
              />
            </View>
            <View style={styles.childTabInfo}>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Child Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={40} color="#8B5CF6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.childName}>{selectedChild.name}</Text>
              <Text style={styles.childDetails}>
                Class {selectedChild.class} • Roll No: {selectedChild.rollNo}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Ionicons
                  name={selectedChild.attendance && selectedChild.attendance >= 75 ? 'checkmark-circle' : 'alert-circle'}
                  size={14}
                  color={statusStyle.text}
                />
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                  {getStatusText(selectedChild.attendance || 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <CircularProgress
                percentage={selectedChild.attendance || 0}
                size={60}
                strokeWidth={6}
                progressColor={getAttendanceColor(selectedChild.attendance || 0)}
              />
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.gpaCircle}>
                <Text style={styles.gpaText}>{selectedChild.gpa || 0}</Text>
              </View>
              <Text style={styles.statLabel}>GPA</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.countCircle}>
                <Text style={styles.countText}>{childExtras.pendingAssignments}</Text>
              </View>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statBox}>
              <View style={[styles.countCircle, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.countText, { color: '#DC2626' }]}>{childExtras.upcomingExams}</Text>
              </View>
              <Text style={styles.statLabel}>Exams</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
            <Text style={styles.actionText}>Timetable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/student/results?studentId=${selectedChild.id}`)}
          >
            <Ionicons name="ribbon-outline" size={20} color="#8B5CF6" />
            <Text style={styles.actionText}>Results</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#8B5CF6" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Fee Summary for this child */}
        <TouchableOpacity
          style={styles.feeCard}
          onPress={() => router.push('/parent/fees')}
          activeOpacity={0.7}
        >
          <View style={styles.feeContent}>
            <View style={styles.feeIconContainer}>
              <Ionicons name="wallet-outline" size={22} color="#8B5CF6" />
            </View>
            <View style={styles.feeInfo}>
              <Text style={styles.feeTitle}>Pending Fees</Text>
              <Text style={styles.feeAmount}>{formatAmount(965)}</Text>
            </View>
          </View>
          <View style={styles.feeAction}>
            <Text style={styles.feeActionText}>View Details</Text>
            <Ionicons name="chevron-forward" size={18} color="#8B5CF6" />
          </View>
        </TouchableOpacity>

        {/* Recent Grades */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Grades</Text>
          <TouchableOpacity onPress={() => router.push(`/student/results?studentId=${selectedChild.id}`)}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gradesList}>
          {recentGrades.map((grade, index) => (
            <View key={index} style={styles.gradeItem}>
              <View style={styles.gradeLeft}>
                <View style={styles.subjectIcon}>
                  <Ionicons name="book-outline" size={18} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={styles.subjectName}>{grade.subject}</Text>
                  <Text style={styles.gradeDate}>{grade.date}</Text>
                </View>
              </View>
              <View style={styles.gradeRight}>
                <Text style={styles.scoreText}>{grade.score}</Text>
                <View style={[
                  styles.gradeBadge,
                  { backgroundColor: grade.grade.startsWith('A') ? '#D1FAE5' : '#FEF3C7' }
                ]}>
                  <Text style={[
                    styles.gradeText,
                    { color: grade.grade.startsWith('A') ? '#059669' : '#D97706' }
                  ]}>{grade.grade}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Attendance Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Attendance Overview</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attendanceCard}>
          <View style={styles.attendanceRow}>
            <View style={styles.attendanceItem}>
              <View style={[styles.attendanceDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.attendanceLabel}>Present</Text>
              <Text style={styles.attendanceValue}>
                {Math.round((selectedChild.attendance || 0) * 1.8)} days
              </Text>
            </View>
            <View style={styles.attendanceItem}>
              <View style={[styles.attendanceDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.attendanceLabel}>Absent</Text>
              <Text style={styles.attendanceValue}>
                {Math.round((100 - (selectedChild.attendance || 0)) * 0.18)} days
              </Text>
            </View>
            <View style={styles.attendanceItem}>
              <View style={[styles.attendanceDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.attendanceLabel}>Late</Text>
              <Text style={styles.attendanceValue}>3 days</Text>
            </View>
          </View>
          <View style={styles.attendanceBarContainer}>
            <View
              style={[
                styles.attendanceBar,
                { width: `${selectedChild.attendance || 0}%`, backgroundColor: '#22C55E' }
              ]}
            />
          </View>
          <Text style={styles.attendancePercent}>
            {selectedChild.attendance || 0}% Overall Attendance
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  childCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
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
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
    minWidth: 140,
  },
  childTabActive: {
    backgroundColor: '#8B5CF6',
  },
  childTabAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childTabAvatarActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  childTabInfo: {
    flex: 1,
  },
  childTabName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  childTabNameActive: {
    color: '#FFFFFF',
  },
  childTabClass: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  childTabClassActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  gpaCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpaText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  countCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D97706',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  feeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  feeInfo: {},
  feeTitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  feeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feeActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
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
    color: '#8B5CF6',
  },
  gradesList: {
    gap: 12,
    marginBottom: 24,
  },
  gradeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  gradeDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  gradeRight: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  attendanceItem: {
    alignItems: 'center',
  },
  attendanceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  attendanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  attendanceBarContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  attendanceBar: {
    height: '100%',
    borderRadius: 4,
  },
  attendancePercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
