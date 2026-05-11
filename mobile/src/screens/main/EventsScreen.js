import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import FloatingAddButton from '../../components/FloatingAddButton';
import { getEvents } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const EventsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data || []);
    } catch (_) {
      setEvents([]);
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBC';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = useCallback(({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>{item.date ? new Date(item.date).getDate() : '--'}</Text>
          <Text style={styles.dateMonth}>
            {item.date ? new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase() : '---'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <StatusBadge status={item.status || 'UPCOMING'} />
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaIcon}>📍</Text>
        <Text style={styles.metaText}>{item.location || 'Campus'}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaIcon}>🕐</Text>
        <Text style={styles.metaText}>{formatDate(item.date)}{item.date ? '  ' + formatTime(item.date) : ''}</Text>
      </View>

      {item.description ? (
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
      ) : null}

      {item.organizer ? (
        <View style={styles.organizerRow}>
          <Text style={styles.organizerLabel}>Organizer: </Text>
          <Text style={styles.organizer}>{item.organizer}</Text>
        </View>
      ) : null}
    </Card>
  ), []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Campus Events" showMenu={true} />
      <FlatList
        data={events}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No upcoming events</Text>
          </View>
        }
      />
      <FloatingAddButton onPress={() => navigation.navigate('AddEvent')} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  listContent: { padding: SIZES.padding, gap: 12 },
  card: {},
  cardHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  dateBlock: {
    width: 52,
    height: 52,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.gold + '22',
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.gold, lineHeight: 24 },
  dateMonth: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.goldLight, letterSpacing: 0.5 },
  headerInfo: { flex: 1, gap: 6 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  metaIcon: { fontSize: 13 },
  metaText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  description: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
  organizerRow: { flexDirection: 'row', marginTop: 8 },
  organizerLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textMuted },
  organizer: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.gold },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default EventsScreen;
