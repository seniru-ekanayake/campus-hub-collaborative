import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { createEvent } from '../../services/campusService';
import { COLORS, SIZES } from '../../constants/theme';

const AddEventScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ title: '', description: '', location: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.date.trim()) e.date = 'Date is required (YYYY-MM-DD)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      
      
      await createEvent({
        title: form.title,
        description: form.description,
        location: form.location,
        date: form.date, 
        time: form.time,
        status: 'UPCOMING'
      });
      Alert.alert('Success', 'Event created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader title="Add New Event" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Card style={styles.card}>
            <Input label="Event Title" value={form.title} onChangeText={set('title')} error={errors.title} placeholder="e.g. Hackathon 2024" />
            <Input label="Description" value={form.description} onChangeText={set('description')} placeholder="Event details..." multiline />
            <Input label="Location" value={form.location} onChangeText={set('location')} error={errors.location} placeholder="e.g. Main Hall" />
            
            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Date" value={form.date} onChangeText={set('date')} error={errors.date} placeholder="YYYY-MM-DD" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="Time" value={form.time} onChangeText={set('time')} placeholder="HH:MM" />
              </View>
            </View>

            <Button title="Create Event" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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

export default AddEventScreen;
