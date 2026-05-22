import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, ActivityIndicator, Platform } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const LoadingSpinner = ({ fontsLoaded = true }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, !fontsLoaded && styles.systemBoldFont]}>Campus Hub</Text>
        <Text style={[styles.subtitle, !fontsLoaded && styles.systemRegularFont]}>University of Wolverhampton</Text>
      </Animated.View>
      <ActivityIndicator
        size="large"
        color={COLORS.gold}
        style={styles.spinner}
      />
      <Text style={[styles.version, !fontsLoaded && styles.systemRegularFont]}>v1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navyDeep,
  },
  content: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 108,
    marginBottom: 20,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxxl,
    color: COLORS.gold,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  spinner: {
    marginBottom: 20,
  },
  version: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    position: 'absolute',
    bottom: 32,
  },
  systemBoldFont: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-bold',
    fontWeight: 'bold',
  },
  systemRegularFont: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});

export default LoadingSpinner;
