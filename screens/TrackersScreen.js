import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { mockBabyData, mockMotherData } from '../data/mockData';

export default function TrackersScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Health Trackers</Text>
        <Text style={styles.headerSubtitle}>
          Monitor your baby and your recovery
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.trackerCard}
        onPress={() => navigation.navigate('BabyTracker')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[theme.colors.secondary, theme.colors.secondaryLight]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>👶</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Baby Tracker</Text>
              <Text style={styles.cardSubtitle}>
                {mockBabyData.name} • {mockBabyData.age}
              </Text>
              <View style={styles.cardStats}>
                <View style={styles.stat}>
                  <Ionicons
                    name="scale-outline"
                    size={16}
                    color={theme.colors.textDark}
                  />
                  <Text style={styles.statText}>
                    {mockBabyData.weight} kg
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons
                    name="resize-outline"
                    size={16}
                    color={theme.colors.textDark}
                  />
                  <Text style={styles.statText}>
                    {mockBabyData.height} cm
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.textDark}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.trackerCard}
        onPress={() => navigation.navigate('MotherTracker')}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardIcon}>💪</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>My Recovery</Text>
              <Text style={styles.cardSubtitle}>
                {mockMotherData.daysPostpartum} days postpartum
              </Text>
              <View style={styles.cardStats}>
                <View style={styles.stat}>
                  <Ionicons
                    name="happy-outline"
                    size={16}
                    color="#fff"
                  />
                  <Text style={[styles.statText, { color: '#fff' }]}>
                    Mood: {mockMotherData.mood.today}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons
                    name="bed-outline"
                    size={16}
                    color="#fff"
                  />
                  <Text style={[styles.statText, { color: '#fff' }]}>
                    {mockMotherData.sleep.lastNight}
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#fff"
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.quickStats}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>

        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Ionicons
              name="water-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.statCardTitle}>Last Feeding</Text>
          </View>
          <Text style={styles.statCardValue}>
            {mockBabyData.lastFeeding.time}
          </Text>
          <Text style={styles.statCardSubtext}>
            {mockBabyData.lastFeeding.type} • {mockBabyData.lastFeeding.duration}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Ionicons
              name="moon-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.statCardTitle}>Last Sleep</Text>
          </View>
          <Text style={styles.statCardValue}>
            {mockBabyData.lastSleep.duration}
          </Text>
          <Text style={styles.statCardSubtext}>
            {mockBabyData.lastSleep.time}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statCardHeader}>
            <Ionicons
              name="heart-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.statCardTitle}>Recovery Progress</Text>
          </View>
          <View style={styles.progressContainer}>
            {mockMotherData.goals.map((goal) => (
              <View key={goal.id} style={styles.progressItem}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${goal.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {goal.name}: {goal.progress}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
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
  trackerCard: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardGradient: {
    padding: theme.spacing.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginRight: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.h2,
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    ...theme.typography.body,
    color: '#fff',
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
  },
  cardStats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    ...theme.typography.bodySmall,
    marginLeft: 4,
    color: '#fff',
  },
  quickStats: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statCardTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginLeft: theme.spacing.sm,
  },
  statCardValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statCardSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
  },
  progressItem: {
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
});

