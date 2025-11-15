import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { mockComments } from '../data/mockData';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [upvoted, setUpvoted] = useState(post.isUpvoted);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [saved, setSaved] = useState(post.isSaved);
  const [commentText, setCommentText] = useState('');
  const comments = mockComments[post.id] || [];

  const handleUpvote = () => {
    if (upvoted) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setUpvoted(!upvoted);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      // In a real app, this would add the comment
      setCommentText('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.postCard}>
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
          <Text style={styles.content}>{post.content}</Text>

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
                size={24}
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

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setSaved(!saved)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={saved ? theme.colors.primary : theme.colors.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({comments.length})
          </Text>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAvatar}>{comment.authorAvatar}</Text>
                <View style={styles.commentInfo}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                </View>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity style={styles.commentActionButton}>
                  <Ionicons
                    name="heart-outline"
                    size={16}
                    color={theme.colors.textLight}
                  />
                  <Text style={styles.commentActionText}>
                    {comment.upvotes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.commentActionButton}>
                  <Text style={styles.commentActionText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={theme.colors.textLight}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  postCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
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
    fontSize: 40,
    marginRight: theme.spacing.sm,
  },
  authorName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  community: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.sm,
  },
  content: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 24,
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
    ...theme.typography.body,
    color: theme.colors.textLight,
    marginLeft: 8,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: theme.spacing.md,
  },
  commentsTitle: {
    ...theme.typography.h3,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
  },
  commentCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  commentAvatar: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textDark,
  },
  commentTime: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  commentContent: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 22,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  commentActionText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    marginLeft: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  commentInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textDark,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

