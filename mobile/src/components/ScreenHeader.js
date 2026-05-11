import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const ScreenHeader = ({ title, onBack, showMenu, rightAction }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDeep} />
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {rightAction ? rightAction : <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.navyDeep,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.navyBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.navyCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
  },
  backIcon: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    lineHeight: 20,
  },
  menuIcon: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    lineHeight: 20,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 36,
  },
});

export default ScreenHeader;
