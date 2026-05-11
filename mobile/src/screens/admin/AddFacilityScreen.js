import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { createFacility } from '../../services/campusService';
import { COLORS, SIZES } from '../../constants/theme';

const AddFacilityScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ name: '', type: '', building: '', floor: '', openingHours: '', capacity: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.type.trim()) e.type = 'Type is required';
    if (!form.building.trim()) e.building = 'Building is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createFacility({
        name: form.name,
        type: form.type,
        building: form.building,
        floor: form.floor,
        openingHours: form.openingHours,
        capacity: parseInt(form.capacity) || 0,
        status: 'OPEN'
      });
      Alert.alert('Success', 'Facility created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create facility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader title="Add New Facility" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Input label="Facility Name" value={form.name} onChangeText={set('name')} error={errors.name} placeholder="e.g. Science Lab 101" />
            
            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Type" value={form.type} onChangeText={set('type')} error={errors.type} placeholder="e.g. Lab, Cafe" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="Building" value={form.building} onChangeText={set('building')} error={errors.building} placeholder="e.g. Block A" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Floor" value={form.floor} onChangeText={set('floor')} placeholder="e.g. 1" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="Capacity" value={form.capacity} onChangeText={set('capacity')} placeholder="e.g. 50" keyboardType="numeric" />
              </View>
            </View>

            <Input label="Opening Hours" value={form.openingHours} onChangeText={set('openingHours')} placeholder="e.g. 08:00 - 18:00" />

            <Button title="Create Facility" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
          </Card>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.navyDeep },
  scroll: { padding: SIZES.padding },
  card: { gap: 16 },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
  spacer: { width: 12 },
  submitBtn: { marginTop: 8 },
});

export default AddFacilityScreen;
