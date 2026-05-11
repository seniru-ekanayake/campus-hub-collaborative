import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { createTransport } from '../../services/campusService';
import { COLORS, SIZES } from '../../constants/theme';

const AddTransportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ routeName: '', busNumber: '', departureTime: '', arrivalTime: '', startLocation: '', endLocation: '', status: 'ON_TIME' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.routeName.trim()) e.routeName = 'Required';
    if (!form.busNumber.trim()) e.busNumber = 'Required';
    if (!form.startLocation.trim()) e.startLocation = 'Required';
    if (!form.endLocation.trim()) e.endLocation = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createTransport({
        routeName: form.routeName,
        busNumber: form.busNumber,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        startLocation: form.startLocation,
        endLocation: form.endLocation,
        status: form.status
      });
      Alert.alert('Success', 'Transport schedule added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add transport schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader title="Add Transport Schedule" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Route Name" value={form.routeName} onChangeText={set('routeName')} error={errors.routeName} placeholder="e.g. Campus Loop" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="Bus Number" value={form.busNumber} onChangeText={set('busNumber')} error={errors.busNumber} placeholder="e.g. 42" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="From" value={form.startLocation} onChangeText={set('startLocation')} error={errors.startLocation} placeholder="City Center" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="To" value={form.endLocation} onChangeText={set('endLocation')} error={errors.endLocation} placeholder="Main Campus" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Departure" value={form.departureTime} onChangeText={set('departureTime')} placeholder="HH:MM" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="Arrival" value={form.arrivalTime} onChangeText={set('arrivalTime')} placeholder="HH:MM" />
              </View>
            </View>

            <Input label="Status" value={form.status} onChangeText={set('status')} placeholder="ON_TIME or DELAYED" />

            <Button title="Add Schedule" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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

export default AddTransportScreen;
