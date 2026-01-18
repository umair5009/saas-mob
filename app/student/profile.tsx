import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, CURRENCIES, CurrencyCode } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { theme, isDark, toggleTheme } = useTheme();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} />

      {/* Blue Header Section */}
      <View style={[styles.headerSection, { paddingTop: insets.top + 10, backgroundColor: theme.primary }]}>
        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.backgroundTertiary }]}>
              <Ionicons name="person" size={50} color={theme.textSecondary} />
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: theme.primary }]}>
              <Ionicons name="pencil" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'Alex Johnson'}</Text>
          <View style={styles.userInfoRow}>
            <View style={styles.studentBadge}>
              <Text style={styles.studentBadgeText}>Student</Text>
            </View>
            <Text style={styles.studentId}>ID: ST-2023-89</Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>10-A</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Class</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>24</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Roll No</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.error }]}>95%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Attendance</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT SETTINGS</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="person" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: theme.borderLight }]} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="lock-closed" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: theme.borderLight }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/student/notifications')}
          >
            <View style={[styles.menuIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="notifications" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Notifications</Text>
            <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GENERAL</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: theme.backgroundTertiary }]}>
              <Ionicons name="globe-outline" size={20} color={theme.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Language</Text>
            <Text style={[styles.menuValue, { color: theme.textSecondary }]}>English</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </TouchableOpacity>

          <View style={[styles.menuDivider, { backgroundColor: theme.borderLight }]} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
          >
            <View style={[styles.menuIcon, { backgroundColor: theme.successLight }]}>
              <Ionicons name="cash-outline" size={20} color={theme.successDark} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Currency</Text>
            <Text style={[styles.menuValue, { color: theme.textSecondary }]}>{currency.symbol} {currency.code}</Text>
            <Ionicons name={showCurrencyPicker ? "chevron-up" : "chevron-forward"} size={20} color={theme.textTertiary} />
          </TouchableOpacity>

          {showCurrencyPicker && (
            <View style={[styles.currencyPicker, { backgroundColor: theme.backgroundTertiary }]}>
              {Object.values(CURRENCIES).map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyOption,
                    { borderBottomColor: theme.border },
                    currency.code === curr.code && [styles.currencyOptionActive, { backgroundColor: theme.primaryLight }],
                  ]}
                  onPress={() => {
                    setCurrency(curr.code as CurrencyCode);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={[
                    styles.currencySymbol,
                    { color: theme.text },
                    currency.code === curr.code && { color: theme.primary },
                  ]}>
                    {curr.symbol}
                  </Text>
                  <View style={styles.currencyInfo}>
                    <Text style={[
                      styles.currencyCode,
                      { color: theme.text },
                      currency.code === curr.code && { color: theme.primary },
                    ]}>
                      {curr.code}
                    </Text>
                    <Text style={[styles.currencyName, { color: theme.textSecondary }]}>{curr.name}</Text>
                  </View>
                  {currency.code === curr.code && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={[styles.menuDivider, { backgroundColor: theme.borderLight }]} />

          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: isDark ? theme.warningLight : '#F3F4F6' }]}>
              <Ionicons name="moon" size={20} color={isDark ? theme.warning : theme.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={theme.border}
            />
          </View>

          <View style={[styles.menuDivider, { backgroundColor: theme.borderLight }]} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: theme.backgroundTertiary }]}>
              <Ionicons name="help-circle" size={20} color={theme.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.card, borderColor: theme.errorLight }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textTertiary }]}>App Version 2.4.0 (Build 342)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSection: {
    backgroundColor: '#3B82F6',
    paddingBottom: 60,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 4,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  studentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  studentBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  studentId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    flexDirection: 'row',
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    marginTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 60,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  notificationBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  currencyPicker: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  currencyOptionActive: {
    backgroundColor: '#EFF6FF',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    width: 40,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  currencyName: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  currencyTextActive: {
    color: '#3B82F6',
  },
});
