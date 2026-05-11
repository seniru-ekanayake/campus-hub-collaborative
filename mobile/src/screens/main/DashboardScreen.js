import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import useAuthStore from '../../store/authStore';
import { getAnnouncements, getEvents, getFacilities } from '../../services/campusService';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const QUICK_ACTIONS = [
  { icon: '📢', label: 'Announcements', screen: 'Announcements' },
  { icon: '📅', label: 'Events', screen: 'Events' },
  { icon: '🏛', label: 'Facilities', screen: 'Facilities' },
  { icon: '👤', label: 'My Profile', screen: 'Profile' },
  { icon: '🚌', label: 'Transport', screen: 'Transport' },
  { icon: '🤝', label: 'Clubs', screen: 'Clubs' },
  { icon: '📍', label: 'Check-In', screen: 'Check-In' },
  { icon: '💚', label: 'Wellbeing', screen: 'Wellbeing' },
];

const DashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, fetchProfile, logout } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [a, e, f] = await Promise.all([getAnnouncements(), getEvents(), getFacilities()]);
      setAnnouncements(a.data?.slice(0, 3) || []);
      setEvents(e.data?.slice(0, 3) || []);
      setFacilities(f.data?.slice(0, 3) || []);
    } catch (_) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProfile().catch(() => {});
    loadData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDeep} />

      <LinearGradient colors={[COLORS.navyDeep, COLORS.navyMid]} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginRight: 12 }}>
              <Text style={{ fontSize: 28, color: COLORS.gold }}>☰</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.userName}>
                {user?.firstName || user?.username || 'Student'} 👋
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
            <Text style={styles.logoutIcon}>⎋</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{announcements.length}</Text>
            <Text style={styles.statLabel}>Notices</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{facilities.length}</Text>
            <Text style={styles.statLabel}>Facilities</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
        }
      >
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((qa) => (
            <TouchableOpacity
              key={qa.screen}
              style={styles.quickCard}
              onPress={() => navigation.navigate(qa.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickIcon}>{qa.icon}</Text>
              <Text style={styles.quickLabel}>{qa.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {announcements.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No announcements available</Text>
          </Card>
        ) : (
          announcements.map((item, i) => (
            <Card key={item.id || i} style={styles.announcementCard}>
              <View style={styles.categoryRow}>
                <View style={[styles.categoryDot, { backgroundColor: COLORS.gold }]} />
                <Text style={styles.category}>{item.category || 'General'}</Text>
              </View>
              <Text style={styles.announcementTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.announcementBody} numberOfLines={2}>{item.content}</Text>
            </Card>
          ))
        )}

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming events</Text>
          </Card>
        ) : (
          events.map((item, i) => (
            <Card key={item.id || i} style={styles.eventCard}>
              <View style={styles.eventDateBox}>
                <Text style={styles.eventDay}>
                  {item.date ? new Date(item.date).getDate() : '--'}
                </Text>
                <Text style={styles.eventMonth}>
                  {item.date ? new Date(item.date).toLocaleString('default', { month: 'short' }) : '---'}
                </Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.eventLocation} numberOfLines={1}>
                  {item.location || 'Campus'}
                </Text>
              </View>
            </Card>
          ))
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.textPrimary,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.navyCard,
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: { fontSize: 18 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyCard,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
    paddingVertical: 14,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.gold },
  statLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.navyBorder },
  scroll: { flex: 1 },
  scrollContent: { padding: SIZES.padding },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 12,
  },
  seeAll: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.gold },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    width: '47%',
    backgroundColor: COLORS.navyCard,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  quickIcon: { fontSize: 30, marginBottom: 8 },
  quickLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textPrimary },
  emptyCard: { alignItems: 'center', paddingVertical: 24, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textMuted },
  announcementCard: { marginBottom: 10 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  categoryDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  category: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 0.5 },
  announcementTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.textPrimary, marginBottom: 4 },
  announcementBody: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  eventCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  eventDateBox: { width: 48, alignItems: 'center', marginRight: 12 },
  eventDay: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.gold },
  eventMonth: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary, textTransform: 'uppercase' },
  eventInfo: { flex: 1 },
  eventTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.textPrimary, marginBottom: 2 },
  eventLocation: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  bottomPad: { height: 20 },
});

export default DashboardScreen;
