import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function DoctorDetailScreen({ route, navigation }) {
  const { doctor } = route.params;

  const handleBookConsultation = () => {
    navigation.navigate('Booking', { doctor });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{doctor.avatar}</Text>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={24} color={theme.colors.accent} />
          <Text style={styles.rating}>{doctor.rating}</Text>
          <Text style={styles.reviews}>({doctor.reviews} reviews)</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{doctor.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <View style={styles.infoRow}>
          <Ionicons
            name="briefcase-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.infoText}>{doctor.experience} of experience</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <View style={styles.languagesContainer}>
          {doctor.languages.map((lang, index) => (
            <View key={index} style={styles.languageTag}>
              <Text style={styles.languageText}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        {doctor.availableToday ? (
          <View style={styles.availabilityRow}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Available Today</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.infoText}>
            Next available: {doctor.nextAvailable}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultation Fee</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${doctor.price}</Text>
          <Text style={styles.priceLabel}>per consultation</Text>
        </View>
      </View>

      <View style={styles.consultationTypes}>
        <Text style={styles.sectionTitle}>Consultation Types</Text>
        <View style={styles.typeCard}>
          <Ionicons name="videocam" size={24} color={theme.colors.primary} />
          <Text style={styles.typeText}>Video Call</Text>
        </View>
        <View style={styles.typeCard}>
          <Ionicons name="call" size={24} color={theme.colors.primary} />
          <Text style={styles.typeText}>Voice Call</Text>
        </View>
        <View style={styles.typeCard}>
          <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
          <Text style={styles.typeText}>Chat</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookConsultation}
        activeOpacity={0.8}
      >
        <Text style={styles.bookButtonText}>Book Consultation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  avatar: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  specialization: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginLeft: theme.spacing.xs,
  },
  reviews: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
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
    marginBottom: theme.spacing.sm,
  },
  bio: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  languageTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  languageText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primaryDark,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  availableDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
    marginRight: theme.spacing.xs,
  },
  availableText: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: theme.spacing.xs,
  },
  price: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  priceLabel: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  consultationTypes: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
  },
  typeText: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    marginLeft: theme.spacing.sm,
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

