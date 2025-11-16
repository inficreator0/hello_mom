import { createContext, useContext, useState, ReactNode } from "react";
import { Post, Comment } from "../types";

interface PostsContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  getPostById: (id: string) => Post | undefined;
  updatePost: (postId: string, updater: (post: Post) => Post) => void;
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
  initialPosts: Post[];
}

export const PostsProvider = ({ children, initialPosts }: PostsProviderProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const getPostById = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  const updatePost = (postId: string, updater: (post: Post) => Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updater(post) : post))
    );
  };

  return (
    <PostsContext.Provider value={{ posts, setPosts, getPostById, updatePost }}>
      {children}
    </PostsContext.Provider>
  );
};

