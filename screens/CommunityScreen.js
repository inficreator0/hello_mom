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
import { mockPosts, mockCommunities } from '../data/mockData';
import PostCard from '../components/PostCard';

export default function CommunityScreen({ navigation }) {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = selectedCommunity
    ? mockPosts.filter((post) => post.community === selectedCommunity)
    : mockPosts;

  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
    />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryLight]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Hello Mom Community</Text>
        <Text style={styles.headerSubtitle}>
          Connect, share, and support each other
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
          placeholder="Search posts..."
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.communitiesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={mockCommunities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.communityChip,
                selectedCommunity === item.name && styles.communityChipActive,
              ]}
              onPress={() =>
                setSelectedCommunity(
                  selectedCommunity === item.name ? null : item.name
                )
              }
            >
              <Text style={styles.communityIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.communityName,
                  selectedCommunity === item.name &&
                    styles.communityNameActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.communitiesList}
        />
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsList}
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
  communitiesContainer: {
    marginBottom: theme.spacing.sm,
  },
  communitiesList: {
    paddingHorizontal: theme.spacing.md,
  },
  communityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  communityChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  communityIcon: {
    fontSize: 20,
    marginRight: theme.spacing.xs,
  },
  communityName: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  communityNameActive: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  postsList: {
    paddingBottom: theme.spacing.xl,
  },
});

