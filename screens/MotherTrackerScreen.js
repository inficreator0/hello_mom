import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { mockMotherData } from '../data/mockData';

export default function MotherTrackerScreen() {
  const [motherData] = useState(mockMotherData);

  const handleLogMood = () => {
    Alert.alert('Log Mood', 'Feature coming soon!');
  };

  const handleLogSleep = () => {
    Alert.alert('Log Sleep', 'Feature coming soon!');
  };

  const handleLogExercise = () => {
    Alert.alert('Log Exercise', 'Feature coming soon!');
  };

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case 'excellent':
        return theme.colors.success;
      case 'good':
        return theme.colors.primary;
      case 'okay':
        return theme.colors.warning;
      case 'poor':
        return theme.colors.error;
      default:
        return theme.colors.textLight;
    }
  };

  const getPainLevelColor = (level) => {
    if (level <= 2) return theme.colors.success;
    if (level <= 4) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Recovery Journey</Text>
        <Text style={styles.headerSubtitle}>
          {motherData.daysPostpartum} days postpartum
        </Text>
        <View style={styles.recoveryStats}>
          <View style={styles.recoveryItem}>
            <Ionicons
              name="heart"
              size={24}
              color={getMoodColor(motherData.mood.today)}
            />
            <Text style={styles.recoveryLabel}>Mood</Text>
            <Text
              style={[
                styles.recoveryValue,
                { color: getMoodColor(motherData.mood.today) },
              ]}
            >
              {motherData.mood.today}
            </Text>
          </View>
          <View style={styles.recoveryItem}>
            <Ionicons
              name="bed"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.recoveryLabel}>Sleep</Text>
            <Text style={styles.recoveryValue}>
              {motherData.sleep.lastNight}
            </Text>
          </View>
          <View style={styles.recoveryItem}>
            <Ionicons
              name="fitness"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.recoveryLabel}>Energy</Text>
            <Text style={styles.recoveryValue}>
              {motherData.recovery.energyLevel}/10
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleLogMood}
          activeOpacity={0.7}
        >
          <Ionicons name="happy" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Mood</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleLogSleep}
          activeOpacity={0.7}
        >
          <Ionicons name="moon" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Sleep</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleLogExercise}
          activeOpacity={0.7}
        >
          <Ionicons name="fitness" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Exercise</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Recovery</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bleeding Status</Text>
            <View
              style={[
                styles.statusBadge,
                motherData.recovery.bleeding === 'Stopped' &&
                  styles.statusBadgeSuccess,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  motherData.recovery.bleeding === 'Stopped' &&
                    styles.statusTextSuccess,
                ]}
              >
                {motherData.recovery.bleeding}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pain Level</Text>
            <View style={styles.painLevelContainer}>
              <View
                style={[
                  styles.painLevelBar,
                  {
                    width: `${(motherData.recovery.painLevel / 10) * 100}%`,
                    backgroundColor: getPainLevelColor(motherData.recovery.painLevel),
                  },
                ]}
              />
              <Text
                style={[
                  styles.painLevelText,
                  { color: getPainLevelColor(motherData.recovery.painLevel) },
                ]}
              >
                {motherData.recovery.painLevel}/10
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Incision Healing</Text>
            <Text style={styles.infoValue}>
              {motherData.recovery.incisionHealing}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Energy Level</Text>
            <View style={styles.energyContainer}>
              <View
                style={[
                  styles.energyBar,
                  {
                    width: `${(motherData.recovery.energyLevel / 10) * 100}%`,
                  },
                ]}
              />
              <Text style={styles.energyText}>
                {motherData.recovery.energyLevel}/10
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mental Health</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Today's Mood</Text>
            <View
              style={[
                styles.moodBadge,
                { backgroundColor: getMoodColor(motherData.mood.today) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.moodText,
                  { color: getMoodColor(motherData.mood.today) },
                ]}
              >
                {motherData.mood.today}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Average Mood</Text>
            <Text style={styles.infoValue}>{motherData.mood.average}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Check</Text>
            <Text style={styles.infoValue}>{motherData.mood.lastCheck}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep & Rest</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Night</Text>
            <Text style={styles.infoValue}>
              {motherData.sleep.lastNight}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Average Sleep</Text>
            <Text style={styles.infoValue}>{motherData.sleep.average}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sleep Quality</Text>
            <Text style={styles.infoValue}>{motherData.sleep.quality}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Breastfeeding</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sessions Today</Text>
            <Text style={styles.infoValue}>
              {motherData.breastfeeding.sessionsToday}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Duration</Text>
            <Text style={styles.infoValue}>
              {motherData.breastfeeding.totalDuration}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Challenges</Text>
            <Text style={styles.infoValue}>
              {motherData.breastfeeding.challenges}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recovery Goals</Text>
        {motherData.goals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalName}>{goal.name}</Text>
              <Text style={styles.goalProgress}>{goal.progress}%</Text>
            </View>
            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  { width: `${goal.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.goalTarget}>
              Target: {goal.target}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  recoveryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  recoveryItem: {
    alignItems: 'center',
  },
  recoveryLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    marginBottom: 4,
  },
  recoveryValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 90,
    ...theme.shadows.small,
  },
  quickActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textDark,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.textDark,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadgeSuccess: {
    backgroundColor: theme.colors.success,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  statusTextSuccess: {
    color: '#fff',
  },
  painLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    height: 20,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  painLevelBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  painLevelText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 4,
    zIndex: 1,
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    height: 20,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  energyBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    left: 0,
  },
  energyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textDark,
    fontWeight: '600',
    marginLeft: 'auto',
    marginRight: 4,
    zIndex: 1,
  },
  moodBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  moodText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  goalName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textDark,
    flex: 1,
  },
  goalProgress: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  goalTarget: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
});

