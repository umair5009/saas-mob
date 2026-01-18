import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuth, DUMMY_USERS } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

interface SubjectResult {
  subject: string;
  teacher: string;
  score: number;
  maxScore: number;
  grade: string;
  status: 'pass' | 'fail';
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  // If studentId is passed (parent viewing child), use that; otherwise use logged-in student
  const studentId = params.studentId as string;
  const studentData = studentId
    ? DUMMY_USERS.students.find(s => s.id === studentId)
    : user;

  const [selectedExam, setSelectedExam] = useState('Mid-Term Exams 2023');
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed' | 'failed'>('all');

  const exams = ['Mid-Term Exams 2023', 'Final Exams 2023', 'Unit Test 1', 'Unit Test 2'];

  // Results data (would come from API in real app)
  const results: SubjectResult[] = [
    { subject: 'Mathematics', teacher: 'Mr. Anderson', score: 92, maxScore: 100, grade: 'A', status: 'pass' },
    { subject: 'Physics', teacher: 'Ms. Curie', score: 88, maxScore: 100, grade: 'B+', status: 'pass' },
    { subject: 'History', teacher: 'Mr. Hooligan', score: 45, maxScore: 100, grade: 'D', status: 'fail' },
    { subject: 'English Lit', teacher: 'Mrs. Woolf', score: 85, maxScore: 100, grade: 'A-', status: 'pass' },
    { subject: 'Chemistry', teacher: 'Mr. White', score: 78, maxScore: 100, grade: 'B', status: 'pass' },
  ];

  const filteredResults = results.filter(r => {
    if (activeFilter === 'passed') return r.status === 'pass';
    if (activeFilter === 'failed') return r.status === 'fail';
    return true;
  });

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxTotalScore = results.reduce((sum, r) => sum + r.maxScore, 0);
  const overallGPA = studentData?.gpa || 3.8;
  const performancePercent = (totalScore / maxTotalScore) * 100;

  const getPerformanceLabel = (percent: number) => {
    if (percent >= 90) return 'Excellent';
    if (percent >= 80) return 'Very Good';
    if (percent >= 70) return 'Good';
    if (percent >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#2563EB';
    if (grade.startsWith('B')) return '#8B5CF6';
    if (grade.startsWith('C')) return '#F59E0B';
    if (grade.startsWith('D')) return '#DC2626';
    return '#EF4444';
  };

  const getGradeBg = (grade: string) => {
    if (grade.startsWith('A')) return '#DBEAFE';
    if (grade.startsWith('B')) return '#F3E8FF';
    if (grade.startsWith('C')) return '#FEF3C7';
    if (grade.startsWith('D')) return '#FEE2E2';
    return '#FEE2E2';
  };

  const isParentView = !!studentId;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isParentView && (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
          )}
          <View style={styles.studentInfo}>
            <View style={styles.studentAvatar}>
              <Ionicons name="person" size={24} color="#6B7280" />
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.studentName}>{studentData?.name || 'Student'}</Text>
              <Text style={styles.studentClass}>Class {studentData?.class || '10-B'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Exam Selector */}
        <TouchableOpacity style={styles.examSelector}>
          <Text style={styles.examSelectorText}>{selectedExam}</Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Overall Performance Card */}
        <View style={styles.performanceCard}>
          <View style={styles.performanceRow}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Overall GPA</Text>
              <Text style={styles.gpaValue}>{overallGPA}</Text>
            </View>
            <View style={styles.performanceDivider} />
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Total Score</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreValue}>{totalScore}</Text>
                <Text style={styles.scoreMax}>/ {maxTotalScore}</Text>
              </View>
            </View>
          </View>
          <View style={styles.performanceBottom}>
            <Text style={styles.performanceText}>Performance</Text>
            <Text style={styles.performanceStatus}>{getPerformanceLabel(performancePercent)}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${performancePercent}%` }]} />
          </View>
        </View>

        {/* Subject Breakdown Header */}
        <View style={styles.breakdownHeader}>
          <Text style={styles.sectionTitle}>Subject Breakdown</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <Text style={styles.sortValue}>Score</Text>
            <Ionicons name="arrow-down" size={14} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>
              All Results
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'passed' && styles.filterTabActive]}
            onPress={() => setActiveFilter('passed')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'passed' && styles.filterTabTextActive]}>
              Passed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'failed' && styles.filterTabActive]}
            onPress={() => setActiveFilter('failed')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'failed' && styles.filterTabTextActive]}>
              Failed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
        <View style={styles.resultsList}>
          {filteredResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={[styles.gradeCircle, { backgroundColor: getGradeBg(result.grade) }]}>
                <Text style={[styles.gradeText, { color: getGradeColor(result.grade) }]}>
                  {result.grade}
                </Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.subjectName}>{result.subject}</Text>
                <Text style={styles.teacherName}>{result.teacher}</Text>
              </View>
              <View style={styles.resultRight}>
                <View style={styles.scoreContainer}>
                  <Text style={styles.resultScore}>{result.score}/{result.maxScore}</Text>
                  <Ionicons
                    name={result.status === 'pass' ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={result.status === 'pass' ? '#22C55E' : '#EF4444'}
                  />
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: result.status === 'pass' ? '#D1FAE5' : '#FEE2E2' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: result.status === 'pass' ? '#059669' : '#DC2626' }
                  ]}>
                    {result.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Download Report Button */}
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={20} color="#3B82F6" />
          <Text style={styles.downloadText}>Download Full Report</Text>
        </TouchableOpacity>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  studentClass: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  examSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  examSelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  performanceCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  performanceItem: {
    flex: 1,
  },
  performanceDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
  },
  performanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  gpaValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreMax: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4,
  },
  performanceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  performanceText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  performanceStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  breakdownHeader: {
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
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  sortValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  resultsList: {
    gap: 12,
  },
  resultCard: {
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
  gradeCircle: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  gradeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultContent: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 13,
    color: '#6B7280',
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  resultScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 8,
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
