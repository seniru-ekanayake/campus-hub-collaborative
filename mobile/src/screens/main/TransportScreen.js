import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import FloatingAddButton from '../../components/FloatingAddButton';
import { getTransport } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const TransportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getTransport();
      setSchedules(res.data || []);
    } catch (_) {
      setSchedules([]);
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

  const renderItem = useCallback(({ item }) => (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🚌</Text>
        <Text style={styles.route}>{item.route}</Text>
      </View>
      <View style={styles.timeRow}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Departure</Text>
          <Text style={styles.timeValue}>{item.departureTime}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Arrival</Text>
          <Text style={styles.timeValue}>{item.arrivalTime}</Text>
        </View>
      </View>
    </Card>
  ), []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Transport Schedules" showMenu={true} />
      <FlatList
        data={schedules}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🚌</Text>
            <Text style={styles.emptyText}>No transport schedules available</Text>
          </View>
        }
      />
      <FloatingAddButton onPress={() => navigation.navigate('AddTransport')} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  listContent: { padding: SIZES.padding, gap: 12 },
  card: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 24 },
  route: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.textPrimary },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.navyMid, padding: 12, borderRadius: SIZES.radius },
  timeBlock: { alignItems: 'center' },
  timeLabel: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
  timeValue: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.gold },
  arrow: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.textMuted },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default TransportScreen;
