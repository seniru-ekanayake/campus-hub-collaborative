import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { getCounselors, getMySessions, cancelSession } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const WellbeingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('counselors'); 
  const [counselors, setCounselors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [cRes, sRes] = await Promise.all([getCounselors(), getMySessions()]);
      setCounselors(cRes.data || []);
      setSessions(sRes.data || []);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const handleCancelSession = async (id) => {
    Alert.alert('Cancel Session', 'Are you sure you want to cancel this session?', [
      { text: 'Keep Session', style: 'cancel' },
      { 
        text: 'Cancel Session', 
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelSession(id);
            Alert.alert('Success', 'Session cancelled.');
            load();
          } catch (err) {
            Alert.alert('Error', 'Failed to cancel session.');
          }
        }
      }
    ]);
  };

  const renderCounselor = useCallback(({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarIcon}>💚</Text></View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty || 'Counselor'}</Text>
        </View>
      </View>
      {item.bio ? <Text style={styles.bio}>{item.bio}</Text> : null}
      <View style={styles.actionRow}>
        <Button title="Book Session" onPress={() => Alert.alert('Coming Soon', 'Booking from mobile is coming in a future update. Please use the web portal to book.')} style={styles.bookBtn} textStyle={styles.bookBtnText} />
      </View>
    </Card>
  ), []);

  const renderSession = useCallback(({ item }) => (
    <Card style={styles.card}>
      <View style={styles.sessionHeader}>
        <Text style={styles.name}>{item.counselorName || 'Counselor'}</Text>
        <StatusBadge status={item.status || 'SCHEDULED'} />
      </View>
      <Text style={styles.date}>{item.sessionDate ? new Date(item.sessionDate).toLocaleString() : 'Date TBC'}</Text>
      {item.status !== 'CANCELLED' && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelSession(item.id)}>
          <Text style={styles.cancelText}>Cancel Session</Text>
        </TouchableOpacity>
      )}
    </Card>
  ), []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Mental Health & Wellbeing" showMenu={true} />
      
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'counselors' && styles.tabActive]} onPress={() => setTab('counselors')}>
          <Text style={[styles.tabText, tab === 'counselors' && styles.tabTextActive]}>Counselors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'sessions' && styles.tabActive]} onPress={() => setTab('sessions')}>
          <Text style={[styles.tabText, tab === 'sessions' && styles.tabTextActive]}>My Sessions</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'counselors' ? counselors : sessions}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={tab === 'counselors' ? renderCounselor : renderSession}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💚</Text>
            <Text style={styles.emptyText}>Nothing to show here</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  tabRow: { flexDirection: 'row', paddingHorizontal: SIZES.padding, paddingTop: 16, paddingBottom: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: COLORS.navyBorder },
  tabActive: { borderBottomColor: COLORS.gold },
  tabText: { fontFamily: FONTS.semiBold, fontSize: SIZES.base, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.gold },
  listContent: { padding: SIZES.padding, gap: 12 },
  card: { gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.navyMid, alignItems: 'center', justifyContent: 'center' },
  avatarIcon: { fontSize: 20 },
  info: { flex: 1 },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textPrimary },
  specialty: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  bio: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  actionRow: { alignItems: 'flex-start' },
  bookBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  bookBtnText: { fontSize: SIZES.sm },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 8 },
  cancelBtn: { marginTop: 12, alignSelf: 'flex-start' },
  cancelText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.error },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default WellbeingScreen;
