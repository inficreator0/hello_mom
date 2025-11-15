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
import { mockBabyData } from '../data/mockData';

export default function BabyTrackerScreen() {
  const [babyData] = useState(mockBabyData);

  const handleAddFeeding = () => {
    Alert.alert('Add Feeding', 'Feature coming soon!');
  };

  const handleAddSleep = () => {
    Alert.alert('Add Sleep', 'Feature coming soon!');
  };

  const handleAddDiaper = () => {
    Alert.alert('Add Diaper Change', 'Feature coming soon!');
  };

  const handleAddMilestone = () => {
    Alert.alert('Add Milestone', 'Feature coming soon!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.babyName}>{babyData.name}</Text>
        <Text style={styles.babyAge}>{babyData.age} old</Text>
        <View style={styles.growthStats}>
          <View style={styles.growthItem}>
            <Text style={styles.growthValue}>{babyData.weight} kg</Text>
            <Text style={styles.growthLabel}>Weight</Text>
          </View>
          <View style={styles.growthDivider} />
          <View style={styles.growthItem}>
            <Text style={styles.growthValue}>{babyData.height} cm</Text>
            <Text style={styles.growthLabel}>Height</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleAddFeeding}
          activeOpacity={0.7}
        >
          <Ionicons name="water" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Feeding</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleAddSleep}
          activeOpacity={0.7}
        >
          <Ionicons name="moon" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Sleep</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleAddDiaper}
          activeOpacity={0.7}
        >
          <Ionicons name="shirt" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Diaper</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleAddMilestone}
          activeOpacity={0.7}
        >
          <Ionicons name="trophy" size={28} color={theme.colors.primary} />
          <Text style={styles.quickActionText}>Milestone</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.activityTitle}>Last Feeding</Text>
          </View>
          <Text style={styles.activityValue}>{babyData.lastFeeding.time}</Text>
          <Text style={styles.activitySubtext}>
            {babyData.lastFeeding.type} • {babyData.lastFeeding.duration}
          </Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="moon-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.activityTitle}>Last Sleep</Text>
          </View>
          <Text style={styles.activityValue}>{babyData.lastSleep.duration}</Text>
          <Text style={styles.activitySubtext}>
            Woke up {babyData.lastSleep.time}
          </Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Ionicons name="shirt-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.activityTitle}>Last Diaper Change</Text>
          </View>
          <Text style={styles.activityValue}>{babyData.lastDiaper.time}</Text>
          <Text style={styles.activitySubtext}>
            Type: {babyData.lastDiaper.type}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Development Milestones</Text>
        {babyData.milestones.map((milestone) => (
          <View key={milestone.id} style={styles.milestoneCard}>
            <View style={styles.milestoneHeader}>
              <Ionicons
                name={milestone.achieved ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={milestone.achieved ? theme.colors.success : theme.colors.textLight}
              />
              <View style={styles.milestoneInfo}>
                <Text
                  style={[
                    styles.milestoneName,
                    milestone.achieved && styles.milestoneAchieved,
                  ]}
                >
                  {milestone.name}
                </Text>
                {milestone.achieved ? (
                  <Text style={styles.milestoneDate}>
                    Achieved on {milestone.date}
                  </Text>
                ) : (
                  <Text style={styles.milestoneDate}>
                    Expected around {milestone.expected}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vaccination Schedule</Text>
        {babyData.vaccinations.map((vaccine) => (
          <View key={vaccine.id} style={styles.vaccineCard}>
            <View style={styles.vaccineHeader}>
              <Ionicons
                name={
                  vaccine.status === 'Completed'
                    ? 'checkmark-circle'
                    : vaccine.status === 'Upcoming'
                    ? 'time-outline'
                    : 'ellipse-outline'
                }
                size={24}
                color={
                  vaccine.status === 'Completed'
                    ? theme.colors.success
                    : theme.colors.primary
                }
              />
              <View style={styles.vaccineInfo}>
                <Text style={styles.vaccineName}>{vaccine.name}</Text>
                <Text style={styles.vaccineDate}>
                  {vaccine.status === 'Completed'
                    ? `Completed on ${vaccine.date}`
                    : `Scheduled for ${vaccine.date}`}
                </Text>
              </View>
              <View
                style={[
                  styles.vaccineStatus,
                  vaccine.status === 'Completed' && styles.vaccineStatusCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.vaccineStatusText,
                    vaccine.status === 'Completed' && styles.vaccineStatusTextCompleted,
                  ]}
                >
                  {vaccine.status}
                </Text>
              </View>
            </View>
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
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  babyName: {
    ...theme.typography.h1,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  babyAge: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  growthStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  growthItem: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  growthDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  growthValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  growthLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
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
    minWidth: 80,
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
  activityCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activityTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginLeft: theme.spacing.sm,
  },
  activityValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  activitySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  milestoneCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  milestoneName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  milestoneAchieved: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  milestoneDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  vaccineCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  vaccineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaccineInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  vaccineName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  vaccineDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  vaccineStatus: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  vaccineStatusCompleted: {
    backgroundColor: theme.colors.success,
  },
  vaccineStatusText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  vaccineStatusTextCompleted: {
    color: '#fff',
  },
});

