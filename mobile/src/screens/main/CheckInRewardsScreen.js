import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMyCheckIns, getRewards } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CheckInRewardsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('history'); 
  const [history, setHistory] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [hRes, rRes] = await Promise.all([getMyCheckIns(), getRewards()]);
      setHistory(hRes.data || []);
      setRewards(rRes.data || []);
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

  const renderHistory = useCallback(({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.icon}>📍</Text>
        <View style={styles.info}>
          <Text style={styles.title}>{item.locationType}</Text>
          <Text style={styles.date}>{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{item.pointsEarned} pts</Text>
        </View>
      </View>
    </Card>
  ), []);

  const renderReward = useCallback(({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.rewardName}>{item.name}</Text>
      {item.description ? <Text style={styles.rewardDesc}>{item.description}</Text> : null}
      <View style={styles.rewardFooter}>
        <Text style={styles.rewardCost}>{item.pointsRequired} pts required</Text>
      </View>
    </Card>
  ), []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Check-In & Rewards" showMenu={true} />
      
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'history' && styles.tabActive]} onPress={() => setTab('history')}>
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'rewards' && styles.tabActive]} onPress={() => setTab('rewards')}>
          <Text style={[styles.tabText, tab === 'rewards' && styles.tabTextActive]}>Rewards</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'history' ? history : rewards}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={tab === 'history' ? renderHistory : renderReward}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{tab === 'history' ? '📍' : '🎁'}</Text>
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
  card: {},
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textPrimary },
  date: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  pointsBadge: { backgroundColor: COLORS.gold + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.gold },
  pointsText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: COLORS.gold },
  rewardName: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textPrimary },
  rewardDesc: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  rewardFooter: { marginTop: 12, alignItems: 'flex-start' },
  rewardCost: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.gold, backgroundColor: COLORS.gold + '22', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default CheckInRewardsScreen;
