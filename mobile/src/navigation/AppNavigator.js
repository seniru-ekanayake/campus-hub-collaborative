import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/main/DashboardScreen';
import AnnouncementsScreen from '../screens/main/AnnouncementsScreen';
import EventsScreen from '../screens/main/EventsScreen';
import FacilitiesScreen from '../screens/main/FacilitiesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import TransportScreen from '../screens/main/TransportScreen';
import ClubsScreen from '../screens/main/ClubsScreen';
import CheckInRewardsScreen from '../screens/main/CheckInRewardsScreen';
import WellbeingScreen from '../screens/main/WellbeingScreen';

import AddEventScreen from '../screens/admin/AddEventScreen';
import AddFacilityScreen from '../screens/admin/AddFacilityScreen';
import AddTransportScreen from '../screens/admin/AddTransportScreen';
import AddClubScreen from '../screens/admin/AddClubScreen';
import AddAnnouncementScreen from '../screens/admin/AddAnnouncementScreen';

import { COLORS, FONTS, SIZES } from '../constants/theme';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const CustomDrawerContent = (props) => (
  <DrawerContentScrollView
    {...props}
    contentContainerStyle={{ flex: 1 }}
    style={{ backgroundColor: COLORS.navyDeep }}
  >
    {/* Logo Header */}
    <View style={styles.drawerHeader}>
      <View style={styles.logoRow}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleBlock}>
          <Text style={styles.appName}>Campus Hub</Text>
          <Text style={styles.subtitle}>University of Wolverhampton</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>

    {/* Drawer Items */}
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

const DrawerNav = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: { backgroundColor: COLORS.navyDeep },
      drawerActiveTintColor: COLORS.gold,
      drawerInactiveTintColor: COLORS.textSecondary,
      drawerLabelStyle: { fontFamily: FONTS.semiBold, fontSize: SIZES.md },
      drawerActiveBackgroundColor: COLORS.navyCard,
    }}
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Announcements" component={AnnouncementsScreen} />
    <Drawer.Screen name="Events" component={EventsScreen} />
    <Drawer.Screen name="Facilities" component={FacilitiesScreen} />
    <Drawer.Screen name="Transport" component={TransportScreen} />
    <Drawer.Screen name="Clubs" component={ClubsScreen} />
    <Drawer.Screen name="Check-In" component={CheckInRewardsScreen} />
    <Drawer.Screen name="Wellbeing" component={WellbeingScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={DrawerNav} />
    <Stack.Screen name="AddEvent" component={AddEventScreen} />
    <Stack.Screen name="AddFacility" component={AddFacilityScreen} />
    <Stack.Screen name="AddTransport" component={AddTransportScreen} />
    <Stack.Screen name="AddClub" component={AddClubScreen} />
    <Stack.Screen name="AddAnnouncement" component={AddAnnouncementScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  drawerHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 44,
    height: 48,
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.navyBorder,
    marginBottom: 8,
  },
});

export default AppNavigator;

