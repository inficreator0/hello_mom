import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function BookingScreen({ route, navigation }) {
  const { doctor } = route.params;
  const [selectedType, setSelectedType] = useState('Video Call');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');

  const consultationTypes = ['Video Call', 'Voice Call', 'Chat'];
  const dates = ['Today', 'Tomorrow', 'Dec 16', 'Dec 17', 'Dec 18'];
  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Booking Confirmed!',
      `Your ${selectedType} consultation with ${doctor.name} is scheduled for ${selectedDate} at ${selectedTime}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Doctors'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.doctorCard}>
        <Text style={styles.avatar}>{doctor.avatar}</Text>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${doctor.price}</Text>
          <Text style={styles.priceLabel}>per consultation</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultation Type</Text>
        <View style={styles.optionsContainer}>
          {consultationTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionCard,
                selectedType === type && styles.optionCardActive,
              ]}
              onPress={() => setSelectedType(type)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  type === 'Video Call'
                    ? 'videocam'
                    : type === 'Voice Call'
                    ? 'call'
                    : 'chatbubble'
                }
                size={24}
                color={
                  selectedType === type
                    ? theme.colors.primary
                    : theme.colors.textLight
                }
              />
              <Text
                style={[
                  styles.optionText,
                  selectedType === type && styles.optionTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.datesContainer}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date}
              style={[
                styles.dateCard,
                selectedDate === date && styles.dateCardActive,
              ]}
              onPress={() => setSelectedDate(date)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === date && styles.dateTextActive,
                ]}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timesContainer}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.timeCardActive,
              ]}
              onPress={() => setSelectedTime(time)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextActive,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reason for Consultation *</Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Briefly describe your concern..."
          placeholderTextColor={theme.colors.textLight}
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
        activeOpacity={0.8}
      >
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  doctorCard: {
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  avatar: {
    fontSize: 60,
    marginBottom: theme.spacing.sm,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  specialization: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  priceLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  section: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  optionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  optionTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCard: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateCardActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  dateText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  dateTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeCardActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  timeText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  timeTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  reasonInput: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  bookButtonText: {
    ...theme.typography.h3,
    color: '#fff',
  },
});

