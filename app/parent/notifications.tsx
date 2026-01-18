import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

interface Notification {
  id: number;
  type: 'grade' | 'attendance' | 'fee' | 'event' | 'announcement' | 'report';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  child?: string;
  actionLabel?: string;
}

export default function ParentNotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'grade',
      title: 'New Grade Posted',
      message: 'Alex received an A in Mathematics Quiz. View the detailed score breakdown.',
      time: '2 hours ago',
      isRead: false,
      child: 'Alex',
      actionLabel: 'View Grade',
    },
    {
      id: 2,
      type: 'fee',
      title: 'Payment Due Soon',
      message: 'Tuition fee of $450.00 for Alex is due by Oct 30. Pay now to avoid late charges.',
      time: '5 hours ago',
      isRead: false,
      child: 'Alex',
      actionLabel: 'Pay Now',
    },
    {
      id: 3,
      type: 'event',
      title: 'Parent-Teacher Meeting',
      message: 'Scheduled for Nov 5 at 3:00 PM. Please confirm your attendance.',
      time: '1 day ago',
      isRead: false,
      actionLabel: 'Confirm',
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Attendance Alert',
      message: 'Alex was marked present for all classes today. Keep up the good attendance!',
      time: '1 day ago',
      isRead: true,
      child: 'Alex',
    },
    {
      id: 5,
      type: 'report',
      title: 'Report Card Available',
      message: "Alex's mid-term report card is now available. View academic progress.",
      time: '3 days ago',
      isRead: true,
      child: 'Alex',
      actionLabel: 'View Report',
    },
    {
      id: 6,
      type: 'announcement',
      title: 'School Holiday',
      message: 'School will remain closed on Nov 1st for Founder\'s Day celebration.',
      time: '4 days ago',
      isRead: true,
    },
    {
      id: 7,
      type: 'fee',
      title: 'Payment Received',
      message: 'Thank you! Your payment of $450.00 for Term 1 tuition has been received.',
      time: '1 week ago',
      isRead: true,
    },
  ];

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'grade':
        return { bg: '#DBEAFE', color: '#2563EB', icon: 'school' };
      case 'attendance':
        return { bg: '#D1FAE5', color: '#059669', icon: 'checkmark-circle' };
      case 'fee':
        return { bg: '#FEF3C7', color: '#D97706', icon: 'card' };
      case 'event':
        return { bg: '#F3E8FF', color: '#9333EA', icon: 'calendar' };
      case 'announcement':
        return { bg: '#E0E7FF', color: '#4F46E5', icon: 'megaphone' };
      case 'report':
        return { bg: '#FEE2E2', color: '#DC2626', icon: 'document-text' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280', icon: 'notifications' };
    }
  };

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.tabActive]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mark all as read */}
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllRead}>
            <Ionicons name="checkmark-done" size={18} color="#8B5CF6" />
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {filteredNotifications.map((notification) => {
              const style = getNotificationStyle(notification.type);
              return (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.notificationUnread,
                  ]}
                  activeOpacity={0.7}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && <View style={styles.unreadDot} />}

                  <View style={[styles.notificationIcon, { backgroundColor: style.bg }]}>
                    <Ionicons name={style.icon as any} size={22} color={style.color} />
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <View style={styles.titleRow}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        {notification.child && (
                          <View style={styles.childBadge}>
                            <Text style={styles.childBadgeText}>{notification.child}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>

                    {notification.actionLabel && (
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: style.bg }]}>
                        <Text style={[styles.actionButtonText, { color: style.color }]}>
                          {notification.actionLabel}
                        </Text>
                        <Ionicons name="arrow-forward" size={14} color={style.color} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'unread'
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </Text>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  markAllRead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingVertical: 12,
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  notificationUnread: {
    backgroundColor: '#FAF5FF',
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  childBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  childBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
