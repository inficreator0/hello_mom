import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function PostCard({ post, onPress }) {
  const [upvoted, setUpvoted] = useState(post.isUpvoted);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [saved, setSaved] = useState(post.isSaved);

  const handleUpvote = () => {
    if (upvoted) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setUpvoted(!upvoted);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Text style={styles.avatar}>{post.authorAvatar}</Text>
          <View>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.community}>r/{post.community}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {post.content}
      </Text>

      <View style={styles.tags}>
        {post.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleUpvote}
          activeOpacity={0.7}
        >
          <Ionicons
            name={upvoted ? 'heart' : 'heart-outline'}
            size={20}
            color={upvoted ? theme.colors.upvote : theme.colors.textLight}
          />
          <Text
            style={[
              styles.actionText,
              upvoted && { color: theme.colors.upvote },
            ]}
          >
            {upvotes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.colors.textLight}
          />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? theme.colors.primary : theme.colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  authorName: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  community: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
  },
  content: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  actionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
});

