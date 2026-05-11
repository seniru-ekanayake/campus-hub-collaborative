import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import FloatingAddButton from '../../components/FloatingAddButton';
import { getClubs, joinClub, leaveClub } from '../../services/campusService';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const ClubsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const load = async () => {
    try {
      const res = await getClubs();
      setClubs(res.data || []);
    } catch (_) {
      setClubs([]);
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

  const handleAction = async (clubId, action) => {
    setActionLoading(prev => ({ ...prev, [clubId]: true }));
    try {
      if (action === 'join') {
        await joinClub(clubId);
        Alert.alert('Success', 'You have joined the club!');
      } else {
        await leaveClub(clubId);
        Alert.alert('Success', 'You have left the club.');
      }
      await load();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || `Failed to ${action} club.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [clubId]: false }));
    }
  };

  const renderItem = useCallback(({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      {item.description ? <Text style={styles.description} numberOfLines={3}>{item.description}</Text> : null}
      <View style={styles.footer}>
        <Button
          title={item.isMember ? "Leave Club" : "Join Club"}
          variant={item.isMember ? "outline" : "primary"}
          onPress={() => handleAction(item.id, item.isMember ? 'leave' : 'join')}
          loading={actionLoading[item.id]}
          style={styles.actionBtn}
          textStyle={styles.actionBtnText}
        />
      </View>
    </Card>
  ), [actionLoading]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScreenHeader title="Club Hub" showMenu={true} />
      <FlatList
        data={clubs}
        keyExtractor={(item, i) => String(item.id || i)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤝</Text>
            <Text style={styles.emptyText}>No clubs available</Text>
          </View>
        }
      />
      <FloatingAddButton onPress={() => navigation.navigate('AddClub')} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  listContent: { padding: SIZES.padding, gap: 12 },
  card: { gap: 8 },
  name: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.textPrimary },
  description: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  footer: { marginTop: 8, alignItems: 'flex-start' },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  actionBtnText: { fontSize: SIZES.sm },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.base, color: COLORS.textMuted },
});

export default ClubsScreen;
