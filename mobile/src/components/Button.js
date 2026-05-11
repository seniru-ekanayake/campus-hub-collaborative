import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';

const Button = ({ title, onPress, loading, variant = 'primary', style, textStyle }) => {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      style={[styles.base, isOutline ? styles.outline : styles.primary, SHADOWS.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.gold : COLORS.navyDeep} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textPrimary, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.gold,
  },
  outline: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.base,
    letterSpacing: 0.5,
  },
  textPrimary: {
    color: COLORS.navyDeep,
  },
  textOutline: {
    color: COLORS.gold,
  },
});

export default Button;
