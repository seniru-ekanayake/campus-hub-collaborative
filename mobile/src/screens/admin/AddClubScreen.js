import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { createClub } from '../../services/campusService';
import { COLORS, SIZES } from '../../constants/theme';

const AddClubScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ name: '', description: '', category: '', meetingSchedule: '', president: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.category.trim()) e.category = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createClub({
        name: form.name,
        description: form.description,
        category: form.category,
        meetingSchedule: form.meetingSchedule,
        president: form.president,
        memberCount: 1 
      });
      Alert.alert('Success', 'Club created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create club.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader title="Add New Club" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Input label="Club Name" value={form.name} onChangeText={set('name')} error={errors.name} placeholder="e.g. Photography Society" />
            <Input label="Category" value={form.category} onChangeText={set('category')} error={errors.category} placeholder="e.g. Arts, Sports, Tech" />
            <Input label="Description" value={form.description} onChangeText={set('description')} placeholder="What does this club do?" multiline />
            
            <View style={styles.row}>
              <View style={styles.half}>
                <Input label="Meeting Time" value={form.meetingSchedule} onChangeText={set('meetingSchedule')} placeholder="e.g. Fridays 5PM" />
              </View>
              <View style={styles.spacer} />
              <View style={styles.half}>
                <Input label="President" value={form.president} onChangeText={set('president')} placeholder="e.g. John Doe" />
              </View>
            </View>

            <Button title="Create Club" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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

export default AddClubScreen;
