import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const StatusBadge = ({ status }) => {
  const statusMap = {
    OPEN: { color: COLORS.success, label: 'Open' },
    CLOSED: { color: COLORS.error, label: 'Closed' },
    BUSY: { color: COLORS.warning, label: 'Busy' },
    UPCOMING: { color: COLORS.gold, label: 'Upcoming' },
    ACTIVE: { color: COLORS.success, label: 'Active' },
  };
  const config = statusMap[status?.toUpperCase()] || { color: COLORS.textMuted, label: status };
  return (
    <View style={[styles.badge, { backgroundColor: config.color + '22', borderColor: config.color }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xs,
    letterSpacing: 0.3,
  },
});

export default StatusBadge;
