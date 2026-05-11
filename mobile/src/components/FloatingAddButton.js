import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';
import useAuthStore from '../store/authStore';

const FloatingAddButton = ({ onPress }) => {
  const { user } = useAuthStore();

  
  if (user?.role !== 'ROLE_ADMIN') {
    return null;
  }

  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={onPress}>
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    ...SHADOWS.card,
  },
  icon: {
    fontFamily: FONTS.medium,
    fontSize: 32,
    color: COLORS.navyDeep,
    lineHeight: 36,
  },
});

export default FloatingAddButton;
