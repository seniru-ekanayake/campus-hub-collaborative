import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import FloatingAddButton from '../../components/FloatingAddButton';
import { getAnnouncements } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CATEGORIES = ['All', 'Academic', 'Events', 'Health', 'Transport', 'General'];

const CATEGORY_COLORS = {
  Academic: '#5B9BD5',
  Events: '#C9A84C',
  Health: '#2ECC71',
  Transport: '#9B59B6',
  General: '#8FA8CC',
  All: '#C9A84C',
};

const AnnouncementsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [announcements, setAnnouncements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data || []);
      setFiltered(res.data || []);
    } catch (_) {
      setAnnouncements([]);
      setFiltered([]);
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

  useEffect(() => {
    if (activeCategory === 'All') {
      setFiltered(announcements);
    } else {
      setFiltered(announcements.filter((a) => a.category === activeCategory));
    }
  }, [activeCategory, announcements]);

  const renderItem = useCallback(({ item }) => {
    const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.General;
    return (
      <Card style={styles.card}>
        <View style={styles.cardTop}>
          <View style={[styles.categoryPill, { backgroundColor: color + '22', borderColor: color }]}>
            <Text style={[styles.categoryPillText, { color }]}>{item.category || 'General'}</Text>
          </View>
          {item.pinned && <Text style={styles.pinIcon}>📌</Text>}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={3}>{item.content}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.date}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'Recent'}
          </Text>
        </View>
      </Card>
    );
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Announcements" showMenu={true} />

      <View style={styles.filterRow}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => c}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeCategory === item && styles.chipActive]}
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No announcements found</Text>
          </View>
        }
      />
      <FloatingAddButton onPress={() => navigation.navigate('AddAnnouncement')} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  filterRow: { backgroundColor: COLORS.navyDeep, paddingVertical: 10 },
  filterList: { paddingHorizontal: SIZES.padding, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.navyCard,
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.navyDeep },
  listContent: { padding: SIZES.padding, gap: 12 },
  card: { gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryPillText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, letterSpacing: 0.3 },
  pinIcon: { fontSize: 14 },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textPrimary },
  body: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  cardFooter: { marginTop: 8 },
  date: { fontFamily: FONTS.regular, fontSize: SIZES.xs, color: COLORS.textMuted },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default AnnouncementsScreen;
