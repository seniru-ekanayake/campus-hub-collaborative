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

import { COLORS, FONTS } from '../constants/theme';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNav = () => (
  <Drawer.Navigator 
    screenOptions={{ 
      headerShown: false,
      drawerStyle: { backgroundColor: COLORS.navyDeep },
      drawerActiveTintColor: COLORS.gold,
      drawerInactiveTintColor: COLORS.textSecondary,
      drawerLabelStyle: { fontFamily: FONTS.semiBold }
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

export default AppNavigator;
