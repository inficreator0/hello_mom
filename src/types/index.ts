export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  postId: string;
  replies?: Comment[];
  parentId?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  flair?: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  bookmarked: boolean;
  comments: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface PostFormData {
  title: string;
  content: string;
  category: string;
  flair?: string;
}

export type CommunityCategory = 
  | "All"
  | "Pregnancy"
  | "Postpartum"
  | "Feeding"
  | "Sleep"
  | "Mental Health"
  | "Recovery"
  | "Milestones";

