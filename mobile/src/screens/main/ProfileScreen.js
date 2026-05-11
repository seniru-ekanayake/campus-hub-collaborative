import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import useAuthStore from '../../store/authStore';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, fetchProfile, updateProfile, logout } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      fetchProfile()
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) return <LoadingSpinner />;

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || '?';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="My Profile"
        onBack={() => navigation.goBack()}
        rightAction={
          !editing ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={[COLORS.navyMid, COLORS.navyDeep]} style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.fullName}>
              {user?.firstName || ''} {user?.lastName || ''}
            </Text>
            <Text style={styles.username}>@{user?.username || 'student'}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>{user?.role || 'Student'}</Text>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <Card>
              {editing ? (
                <>
                  <View style={styles.row}>
                    <View style={styles.half}>
                      <Input label="First Name" value={form.firstName} onChangeText={set('firstName')} placeholder="First" error={errors.firstName} autoCapitalize="words" />
                    </View>
                    <View style={styles.spacer} />
                    <View style={styles.half}>
                      <Input label="Last Name" value={form.lastName} onChangeText={set('lastName')} placeholder="Last" error={errors.lastName} autoCapitalize="words" />
                    </View>
                  </View>
                  <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="Email address" keyboardType="email-address" error={errors.email} />
                  <View style={styles.actionRow}>
                    <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} style={styles.half} />
                    <View style={styles.spacer} />
                    <Button title="Save Changes" onPress={handleSave} loading={saving} style={styles.half} />
                  </View>
                </>
              ) : (
                <>
                  <ProfileRow icon="👤" label="Full Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not set'} />
                  <ProfileRow icon="📧" label="Email" value={user?.email || 'Not set'} />
                  <ProfileRow icon="🎓" label="Username" value={user?.username || 'Not set'} />
                  <ProfileRow icon="🏷" label="Role" value={user?.role || 'Student'} last />
                </>
              )}
            </Card>
          </View>

          <View style={styles.section}>
            <Button
              title="Sign Out"
              variant="outline"
              onPress={handleLogout}
              style={styles.logoutBtn}
              textStyle={styles.logoutText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const ProfileRow = ({ icon, label, value, last }) => (
  <View style={[profileRowStyles.row, !last && profileRowStyles.border]}>
    <Text style={profileRowStyles.icon}>{icon}</Text>
    <View style={profileRowStyles.textBlock}>
      <Text style={profileRowStyles.label}>{label}</Text>
      <Text style={profileRowStyles.value}>{value}</Text>
    </View>
  </View>
);

const profileRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: COLORS.navyBorder },
  icon: { fontSize: 18, width: 28, textAlign: 'center' },
  textBlock: { flex: 1 },
  label: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  value: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.textPrimary },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: SIZES.padding,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.button,
  },
  avatarText: { fontFamily: FONTS.bold, fontSize: SIZES.xxxl, color: COLORS.navyDeep },
  fullName: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.textPrimary, marginBottom: 2 },
  username: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 10 },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    backgroundColor: COLORS.gold + '22',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  roleText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.gold },
  section: { paddingHorizontal: SIZES.padding, paddingTop: 20 },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.textPrimary, marginBottom: 12 },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
  spacer: { width: 12 },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.gold + '22',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  editBtnText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.gold },
  logoutBtn: { borderColor: COLORS.error },
  logoutText: { color: COLORS.error },
});

export default ProfileScreen;
