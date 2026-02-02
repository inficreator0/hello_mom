import { create } from "zustand";
import { Post, Comment } from "../types";
import { postsAPI, commentsAPI, feedAPI } from "../lib/api/posts";

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  hasLoaded: boolean;
  page: number;
  hasMore: boolean;
  nextCursor: string | null;
  refreshPosts: (category?: string) => Promise<void>;
  loadMorePosts: (category?: string) => Promise<void>;
  loadComments: (postId: string | number) => Promise<void>;
  getPostById: (id: string | number) => Post | undefined;
  updatePost: (postId: string | number, updater: (post: Post) => Post) => void;
  addPost: (post: Post) => void;
  removePost: (postId: string | number) => void;
  toggleBookmark: (postId: string | number) => Promise<void>;
}

// Transform backend post response to frontend Post format
export const transformPost = (backendPost: any): Post => {
  return {
    id: backendPost.id,
    title: backendPost.title,
    content: backendPost.content,
    author: backendPost.authorUsername || "Unknown",
    authorId: backendPost.authorId,
    authorUsername: backendPost.authorUsername,
    category: backendPost.category || "All", // Use category from backend or default to "All"
    flair: backendPost.flair, // Include flair from backend
    votes: (backendPost.upvotes || 0) - (backendPost.downvotes || 0),
    upvotes: backendPost.upvotes || 0,
    downvotes: backendPost.downvotes || 0,
    userVote: backendPost.currentUserVote === "UPVOTE" ? "up" : backendPost.currentUserVote === "DOWNVOTE" ? "down" : null,
    bookmarked: backendPost.saved || false,
    comments: [], // Will be loaded separately
    commentCount: backendPost.commentCount || 0,
    createdAt: new Date(backendPost.createdAt),
    updatedAt: backendPost.updatedAt ? new Date(backendPost.updatedAt) : undefined,
  };
};

// Transform backend comment response to frontend Comment format
export const transformComment = (backendComment: any): Comment => {
  const replies = backendComment.replies
    ? backendComment.replies.map(transformComment)
    : [];

  return {
    id: backendComment.id,
    content: backendComment.content,
    author: backendComment.authorUsername || "Unknown",
    authorId: backendComment.authorId,
    authorUsername: backendComment.authorUsername,
    postId: backendComment.postId,
    parentId: backendComment.parentCommentId || null,
    parentCommentId: backendComment.parentCommentId,
    createdAt: new Date(backendComment.createdAt),
    updatedAt: backendComment.updatedAt ? new Date(backendComment.updatedAt) : undefined,
    upvotes: backendComment.upvotes || 0,
    downvotes: backendComment.downvotes || 0,
    replyCount: backendComment.replyCount || 0,
    replies,
  };
};

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,
  hasLoaded: false,
  page: 0,
  hasMore: true,
  nextCursor: null,

  refreshPosts: async (category?: string) => {
    try {
      set({ isLoading: true, posts: [] });

      const response = await feedAPI.getFeedCursor({
        sort: "recent",
        category: category
      });

      const transformedPosts = response.content.map(transformPost);

      set({
        posts: transformedPosts,
        hasLoaded: true,
        page: 0, // page is less relevant now but keeping for compatibility if needed
        nextCursor: response.nextCursor,
        hasMore: response.hasNext
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ posts: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  loadMorePosts: async (category?: string) => {
    const { nextCursor, hasMore, isLoading, posts } = get();
    if (!hasMore || isLoading || !nextCursor) return;

    try {
      set({ isLoading: true });

      const response = await feedAPI.getFeedCursor({
        sort: "recent",
        category: category,
        cursor: nextCursor
      });

      const transformedNewPosts = response.content.map(transformPost);

      set({
        posts: [...posts, ...transformedNewPosts],
        nextCursor: response.nextCursor,
        hasMore: response.hasNext
      });
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadComments: async (postId: string | number) => {
    try {
      const comments = await commentsAPI.getByPostId(String(postId));
      const transformedComments = comments
        .filter((c: any) => !c.parentCommentId) // Only top-level comments
        .map(transformComment);

      set((state) => ({
        posts: state.posts.map((post) =>
          String(post.id) === String(postId)
            ? { ...post, comments: transformedComments }
            : post
        ),
      }));
    } catch (error) {
      console.error(`Error loading comments for post ${postId}:`, error);
      // Ideally we'd show a toast or error state here, but for now we log it
    }
  },

  getPostById: (id: string | number) => {
    const { posts } = get();
    return posts.find((post) => String(post.id) === String(id));
  },

  updatePost: (postId: string | number, updater: (post: Post) => Post) => {
    set((state) => {
      const postIndex = state.posts.findIndex(
        (post) => String(post.id) === String(postId)
      );
      if (postIndex === -1) return state;

      const currentPost = state.posts[postIndex];
      const updatedPost = updater(currentPost);

      // Only create new array if post actually changed (shallow comparison of key fields)
      // This prevents unnecessary re-renders when the update doesn't change anything
      if (
        currentPost.votes === updatedPost.votes &&
        currentPost.userVote === updatedPost.userVote &&
        currentPost.bookmarked === updatedPost.bookmarked &&
        currentPost.title === updatedPost.title &&
        currentPost.content === updatedPost.content &&
        currentPost.commentCount === updatedPost.commentCount
      ) {
        return state;
      }

      const newPosts = [...state.posts];
      newPosts[postIndex] = updatedPost;
      return { posts: newPosts };
    });
  },
  addPost: (post: Post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }));
  },
  removePost: (postId: string | number) => {
    set((state) => ({
      posts: state.posts.filter((post) => String(post.id) !== String(postId)),
    }));
  },

  toggleBookmark: async (postId: string | number) => {
    const { updatePost } = get();
    const postIdStr = String(postId);
    const post = get().posts.find((p) => String(p.id) === postIdStr);

    if (!post) return;

    const previousBookmarkedState = post.bookmarked;

    // Optimistic update
    updatePost(postId, (p) => ({ ...p, bookmarked: !p.bookmarked }));

    try {
      if (previousBookmarkedState) {
        await postsAPI.unsave(postIdStr);
      } else {
        await postsAPI.save(postIdStr);
      }
    } catch (error: any) {
      console.error("Error toggling bookmark:", error);
      // Revert optimistic update
      updatePost(postId, (p) => ({ ...p, bookmarked: previousBookmarkedState }));
      // Optional: Show toast or alert here via UI
    }
  },
}));


