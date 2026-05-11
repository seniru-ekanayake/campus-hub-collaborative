import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ScreenHeader from '../../components/ScreenHeader';
import useAuthStore from '../../store/authStore';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      Alert.alert('Account Created', 'You can now sign in with your credentials.', [
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Registration Failed', err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[COLORS.navyDeep, COLORS.navyMid]} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="Create Account" onBack={() => navigation.goBack()} />

          <View style={styles.content}>
            <Text style={styles.heading}>Join Campus Hub</Text>
            <Text style={styles.sub}>Register your student account</Text>

            <View style={styles.row}>
              <View style={styles.half}>
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChangeText={set('firstName')}
                  placeholder="First"
                  error={errors.firstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChangeText={set('lastName')}
                  placeholder="Last"
                  error={errors.lastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <Input
              label="Username"
              value={form.username}
              onChangeText={set('username')}
              placeholder="Choose a username"
              error={errors.username}
            />
            <Input
              label="Email Address"
              value={form.email}
              onChangeText={set('email')}
              placeholder="your@email.com"
              keyboardType="email-address"
              error={errors.email}
            />
            <Input
              label="Password"
              value={form.password}
              onChangeText={set('password')}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={set('confirmPassword')}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerBtn}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                Sign In
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  content: { paddingHorizontal: SIZES.padding, paddingTop: 24 },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sub: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
  spacer: { width: 12 },
  registerBtn: { marginTop: 8 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary },
  loginLink: { fontFamily: FONTS.semiBold, fontSize: SIZES.md, color: COLORS.gold },
});

export default RegisterScreen;
