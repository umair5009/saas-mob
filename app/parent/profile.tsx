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

export default function ParentProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { theme, isDark, toggleTheme } = useTheme();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const accountMenuItems = [
    { icon: 'person-outline', label: 'Edit Profile', route: '' },
    { icon: 'people-outline', label: 'Manage Children', route: '' },
    { icon: 'notifications-outline', label: 'Notifications', route: '' },
    { icon: 'card-outline', label: 'Payment Methods', route: '' },
    { icon: 'lock-closed-outline', label: 'Privacy & Security', route: '' },
  ];

  const supportMenuItems = [
    { icon: 'help-circle-outline', label: 'Help & Support', route: '' },
    { icon: 'information-circle-outline', label: 'About', route: '' },
  ];

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} />
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.borderLight }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <View style={[styles.avatarLarge, { backgroundColor: theme.secondaryLight }]}>
            <Ionicons name="person" size={40} color={theme.secondary} />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Parent Name'}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || 'parent@school.com'}</Text>
          <View style={[styles.roleBadge, { backgroundColor: theme.secondaryLight }]}>
            <Text style={[styles.roleText, { color: theme.secondary }]}>Parent • 1 Child Enrolled</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>Contact Information</Text>
          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.text }]}>{user?.email || 'parent@school.com'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.text }]}>{user?.phone || '+1 234 567 8903'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.text }]}>123 Main Street, City</Text>
          </View>
        </View>

        {/* Account Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT SETTINGS</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          {accountMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < accountMenuItems.length - 1 && [styles.menuItemBorder, { borderBottomColor: theme.borderLight }],
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme.secondaryLight }]}>
                <Ionicons name={item.icon as any} size={22} color={theme.secondary} />
              </View>
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* General Settings */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>GENERAL</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: theme.backgroundTertiary }]}>
              <Ionicons name="globe-outline" size={22} color={theme.textSecondary} />
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
              <Ionicons name="cash-outline" size={22} color={theme.successDark} />
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
                    currency.code === curr.code && [styles.currencyOptionActive, { backgroundColor: theme.secondaryLight }],
                  ]}
                  onPress={() => {
                    setCurrency(curr.code as CurrencyCode);
                    setShowCurrencyPicker(false);
                  }}
                >
                  <Text style={[
                    styles.currencySymbol,
                    { color: theme.text },
                    currency.code === curr.code && { color: theme.secondary },
                  ]}>
                    {curr.symbol}
                  </Text>
                  <View style={styles.currencyInfo}>
                    <Text style={[
                      styles.currencyCode,
                      { color: theme.text },
                      currency.code === curr.code && { color: theme.secondary },
                    ]}>
                      {curr.code}
                    </Text>
                    <Text style={[styles.currencyName, { color: theme.textSecondary }]}>{curr.name}</Text>
                  </View>
                  {currency.code === curr.code && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.secondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={[styles.menuDivider, { backgroundColor: theme.borderLight }]} />

          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: isDark ? theme.warningLight : theme.backgroundTertiary }]}>
              <Ionicons name="moon" size={22} color={isDark ? theme.warning : theme.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.secondary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={theme.border}
            />
          </View>
        </View>

        {/* Support */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SUPPORT</Text>
        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>
          {supportMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < supportMenuItems.length - 1 && [styles.menuItemBorder, { borderBottomColor: theme.borderLight }],
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme.backgroundTertiary }]}>
                <Ionicons name={item.icon as any} size={22} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.errorLight }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textTertiary }]}>Version 1.0.0</Text>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
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
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
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
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 60,
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
    backgroundColor: '#F3E8FF',
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
    color: '#8B5CF6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 20,
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
  },
});
