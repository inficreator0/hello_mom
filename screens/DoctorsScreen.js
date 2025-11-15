import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { mockDoctors } from '../data/mockData';

export default function DoctorsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  const specializations = [
    'All',
    'OB-GYN',
    'Pediatrician',
    'Lactation Consultant',
    'Mental Health',
  ];

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      !selectedSpecialization ||
      selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const renderDoctor = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}
      activeOpacity={0.7}
    >
      <View style={styles.doctorHeader}>
        <Text style={styles.doctorAvatar}>{item.avatar}</Text>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorSpecialization}>{item.specialization}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={theme.colors.accent} />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews} reviews)</Text>
          </View>
        </View>
      </View>

      <Text style={styles.doctorBio} numberOfLines={2}>
        {item.bio}
      </Text>

      <View style={styles.doctorFooter}>
        <View style={styles.availabilityContainer}>
          {item.availableToday ? (
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
              <Text style={styles.availableText}>Available Today</Text>
            </View>
          ) : (
            <Text style={styles.nextAvailable}>
              Next: {item.nextAvailable}
            </Text>
          )}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.priceLabel}>/consultation</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Find a Doctor</Text>
        <Text style={styles.headerSubtitle}>
          Connect with healthcare professionals
        </Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors..."
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={specializations}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedSpecialization === item && styles.filterChipActive,
              ]}
              onPress={() =>
                setSelectedSpecialization(
                  selectedSpecialization === item ? null : item
                )
              }
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSpecialization === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.doctorsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: '#fff',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textDark,
    paddingVertical: theme.spacing.sm,
  },
  filtersContainer: {
    marginBottom: theme.spacing.sm,
  },
  filtersList: {
    paddingHorizontal: theme.spacing.md,
  },
  filterChip: {
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  filterText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  filterTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  doctorsList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  doctorCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  doctorAvatar: {
    fontSize: 48,
    marginRight: theme.spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  doctorSpecialization: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.bodySmall,
    color: theme.colors.textDark,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  doctorBio: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  availabilityContainer: {
    flex: 1,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  availableText: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    fontWeight: '600',
  },
  nextAvailable: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  priceLabel: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
});

