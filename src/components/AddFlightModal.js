// src/components/AddFlightModal.js
// "Add Flight" form for Lab 05. Styled with the TicketHub palette (60-30-10).
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';

const COLORS = {
  bg: '#F4F7FA',
  white: '#FFFFFF',
  primary: '#33658A',
  text: '#1F2D3A',
  sub: '#66788A',
  tile: '#ECEFF3',
  border: '#C1C7CF',
  error: '#C0221B',
};

const EMPTY = { airline: '', flight_no: '', price: '', seats: '' };

export default function AddFlightModal({ visible, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const close = () => {
    setForm(EMPTY);
    setErrors({});
    setFocused(null);
    onClose();
  };

  const save = () => {
    const e = {};
    if (form.airline.trim().length < 2) e.airline = 'Enter the airline name.';
    if (form.flight_no.trim().length < 2) e.flight_no = 'Enter the flight number, for example DL 402.';
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0) e.price = 'Enter a price greater than 0.';
    const seats = parseInt(form.seats, 10);
    if (!form.seats || Number.isNaN(seats) || seats <= 0) e.seats = 'Enter the number of seats (1 or more).';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSave({
      airline: form.airline.trim(),
      flight_no: form.flight_no.trim().toUpperCase(),
      price,
      seats,
    });
    setForm(EMPTY);
    setErrors({});
    setFocused(null);
  };

  const field = (key, label, placeholder, keyboardType = 'default') => (
    <View style={styles.group}>
      <Text style={[styles.label, focused === key && { color: COLORS.primary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          focused === key && styles.inputFocused,
          errors[key] && styles.inputError,
        ]}
        value={form[key]}
        onChangeText={set(key)}
        placeholder={placeholder}
        placeholderTextColor={COLORS.sub}
        keyboardType={keyboardType}
        autoCapitalize={key === 'flight_no' ? 'characters' : 'words'}
        onFocus={() => setFocused(key)}
        onBlur={() => setFocused(null)}
      />
      {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add Flight</Text>
          <Text style={styles.subtitle}>New flights are saved on this phone and stay available offline.</Text>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {field('airline', 'Airline', 'Delta Air Lines')}
            {field('flight_no', 'Flight number', 'DL 402')}
            {field('price', 'Price per adult (₱)', '640', 'numeric')}
            {field('seats', 'Seats available', '40', 'number-pad')}
          </ScrollView>
          <TouchableOpacity style={styles.save} onPress={save} activeOpacity={0.85}>
            <Text style={styles.saveText}>Save Flight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={close} activeOpacity={0.85}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(31,45,58,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  subtitle: { fontSize: 13, color: COLORS.sub, marginTop: 4, marginBottom: 14 },
  group: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '500', color: COLORS.sub, marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.tile,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.tile,
  },
  inputFocused: { backgroundColor: COLORS.white, borderColor: COLORS.primary },
  inputError: { borderColor: COLORS.error },
  error: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  save: { height: 48, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  cancel: {
    height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.primary,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  cancelText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
});
