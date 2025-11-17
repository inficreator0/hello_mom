import { create } from "zustand";
import { Post, Comment } from "../types";
import { postsAPI, commentsAPI } from "../lib/api/posts";

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  hasLoaded: boolean;
  refreshPosts: () => Promise<void>;
  getPostById: (id: string | number) => Post | undefined;
  updatePost: (postId: string | number, updater: (post: Post) => Post) => void;
  addPost: (post: Post) => void;
  removePost: (postId: string | number) => void;
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
    category: "All", // Backend doesn't have category, defaulting to "All"
    votes: (backendPost.upvotes || 0) - (backendPost.downvotes || 0),
    upvotes: backendPost.upvotes || 0,
    downvotes: backendPost.downvotes || 0,
    userVote: null, // Will be handled separately if voting is implemented
    bookmarked: false, // Not in backend yet
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

  refreshPosts: async () => {
    try {
      set({ isLoading: true });
      const response = await postsAPI.getAll(0, 50);
      const transformedPosts = response.content.map(transformPost);

      // Load comments for each post
      const postsWithComments = await Promise.all(
        transformedPosts.map(async (post) => {
          try {
            const comments = await commentsAPI.getByPostId(String(post.id));
            const transformedComments = comments
              .filter((c: any) => !c.parentCommentId) // Only top-level comments
              .map(transformComment);
            return { ...post, comments: transformedComments };
          } catch (error) {
            console.error(`Error loading comments for post ${post.id}:`, error);
            return post;
          }
        })
      );

      set({ posts: postsWithComments, hasLoaded: true });
    } catch (error) {
      console.error("Error fetching posts:", error);
      set({ posts: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getPostById: (id: string | number) => {
    const { posts } = get();
    return posts.find((post) => String(post.id) === String(id));
  },

  updatePost: (postId: string | number, updater: (post: Post) => Post) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        String(post.id) === String(postId) ? updater(post) : post
      ),
    }));
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
}));


