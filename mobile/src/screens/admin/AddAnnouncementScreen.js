import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { createAnnouncement } from '../../services/campusService';
import { COLORS, SIZES } from '../../constants/theme';

const AddAnnouncementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ title: '', content: '', category: 'General' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createAnnouncement({
        title: form.title,
        content: form.content,
        category: form.category,
        pinned: false,
        createdAt: new Date().toISOString()
      });
      Alert.alert('Success', 'Announcement posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to post announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ScreenHeader title="New Announcement" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Input label="Title" value={form.title} onChangeText={set('title')} error={errors.title} placeholder="Important Notice" />
            <Input label="Category" value={form.category} onChangeText={set('category')} placeholder="e.g. Academic, Events, Health" />
            <Input label="Content" value={form.content} onChangeText={set('content')} error={errors.content} placeholder="Announcement details..." multiline />
            
            <Button title="Post Announcement" onPress={handleSubmit} loading={loading} style={styles.submitBtn} />
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
  submitBtn: { marginTop: 8 },
});

export default AddAnnouncementScreen;
