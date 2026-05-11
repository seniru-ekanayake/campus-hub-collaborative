import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import FloatingAddButton from '../../components/FloatingAddButton';
import { getFacilities } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const FACILITY_ICONS = {
  library: '📚',
  gym: '🏋️',
  canteen: '🍽',
  cafe: '☕',
  lab: '🔬',
  classroom: '🎓',
  sports: '⚽',
  medical: '🏥',
  parking: '🅿️',
  admin: '🏛',
};

const getIcon = (type) => {
  if (!type) return '🏢';
  const key = Object.keys(FACILITY_ICONS).find((k) => type.toLowerCase().includes(k));
  return key ? FACILITY_ICONS[key] : '🏢';
};

const FacilitiesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getFacilities();
      setFacilities(res.data || []);
    } catch (_) {
      setFacilities([]);
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
      <View style={styles.cardRow}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{getIcon(item.type)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location} numberOfLines={1}>
            {item.building ? `${item.building}` : 'Campus'}
            {item.floor ? `, Floor ${item.floor}` : ''}
          </Text>
          <View style={styles.badgeRow}>
            <StatusBadge status={item.status || 'OPEN'} />
          </View>
        </View>
      </View>
      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      ) : null}
      {item.openingHours ? (
        <View style={styles.hoursRow}>
          <Text style={styles.hoursIcon}>🕐</Text>
          <Text style={styles.hours}>{item.openingHours}</Text>
        </View>
      ) : null}
      {item.capacity ? (
        <View style={styles.capacityRow}>
          <Text style={styles.capacityLabel}>Capacity: </Text>
          <Text style={styles.capacityValue}>{item.capacity}</Text>
        </View>
      ) : null}
    </Card>
  ), []);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Campus Facilities" showMenu={true} />
      <FlatList
        data={facilities}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏛</Text>
            <Text style={styles.emptyText}>No facilities found</Text>
          </View>
        }
      />
      <FloatingAddButton onPress={() => navigation.navigate('AddFacility')} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  listContent: { padding: SIZES.padding, gap: 12 },
  card: {},
  cardRow: { flexDirection: 'row', gap: 12 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.navyMid,
    borderWidth: 1,
    borderColor: COLORS.navyBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24 },
  info: { flex: 1, gap: 4 },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.base, color: COLORS.textPrimary },
  location: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  badgeRow: { marginTop: 2 },
  description: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 10,
  },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  hoursIcon: { fontSize: 13 },
  hours: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  capacityRow: { flexDirection: 'row', marginTop: 4 },
  capacityLabel: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textMuted },
  capacityValue: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.gold },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default FacilitiesScreen;
