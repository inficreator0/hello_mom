import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Post, Comment } from "../types";
import { postsAPI, commentsAPI } from "../lib/api";

interface PostsContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  getPostById: (id: string) => Post | undefined;
  updatePost: (postId: string, updater: (post: Post) => Post) => void;
  refreshPosts: () => Promise<void>;
  isLoading: boolean;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

// Transform backend post response to frontend Post format
const transformPost = (backendPost: any): Post => {
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
const transformComment = (backendComment: any): Comment => {
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

export const PostsProvider = ({ children }: PostsProviderProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPosts = async () => {
    try {
      setIsLoading(true);
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
      
      setPosts(postsWithComments);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const getPostById = (id: string | number) => {
    return posts.find((post) => String(post.id) === String(id));
  };

  const updatePost = (postId: string | number, updater: (post: Post) => Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (String(post.id) === String(postId) ? updater(post) : post))
    );
  };

  return (
    <PostsContext.Provider
      value={{ posts, setPosts, getPostById, updatePost, refreshPosts, isLoading }}
    >
      {children}
    </PostsContext.Provider>
  );
};

