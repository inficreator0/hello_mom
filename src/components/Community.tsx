import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Post, PostFormData, Comment, CommunityCategory } from "../types";
import { usePosts } from "../context/PostsContext";
import SearchBar from "./common/SearchBar";
import PostCard from "./common/PostCard";
import PostFormDialog from "./common/PostFormDialog";
import CommentDialog from "./common/CommentDialog";
import CategoryTabs from "./common/CategoryTabs";

const CATEGORIES: CommunityCategory[] = ["All", "Pregnancy", "Postpartum", "Feeding", "Sleep", "Mental Health", "Recovery", "Milestones"];

const Community = () => {
  const { posts, setPosts, updatePost } = usePosts();

  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    category: "All",
    flair: "",
  });
  const [commentText, setCommentText] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddPost = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: "You",
      category: formData.category,
      flair: formData.flair || undefined,
      votes: 0,
      bookmarked: false,
      comments: [],
      createdAt: new Date(),
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setFormData({ title: "", content: "", category: "All", flair: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditPost = () => {
    if (!editingPost || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    updatePost(editingPost.id, (post) => ({
      ...post,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      flair: formData.flair || undefined,
      updatedAt: new Date(),
    }));

    setEditingPost(null);
    setFormData({ title: "", content: "", category: "All", flair: "" });
    setIsEditDialogOpen(false);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    }
  };

  const handleVote = (postId: string, voteType: "up" | "down") => {
    updatePost(postId, (post) => {
      const currentVote = post.userVote;
      let newVotes = post.votes;

      if (currentVote === voteType) {
        newVotes += voteType === "up" ? -1 : 1;
        return { ...post, votes: newVotes, userVote: null };
      } else if (currentVote === null) {
        newVotes += voteType === "up" ? 1 : -1;
        return { ...post, votes: newVotes, userVote: voteType };
      } else {
        newVotes += voteType === "up" ? 2 : -2;
        return { ...post, votes: newVotes, userVote: voteType };
      }
    });
  };

  const handleBookmark = (postId: string) => {
    updatePost(postId, (post) => ({
      ...post,
      bookmarked: !post.bookmarked,
    }));
  };

  const handleAddComment = () => {
    if (!selectedPostId || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      author: "You",
      postId: selectedPostId,
      createdAt: new Date(),
      replies: [],
    };

    updatePost(selectedPostId, (post) => ({
      ...post,
      comments: [...post.comments, newComment],
    }));

    setCommentText("");
    setIsCommentDialogOpen(false);
    setSelectedPostId(null);
  };

  const handleReply = (postId: string, commentId: string, replyContent: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      content: replyContent,
      author: "You",
      postId: postId,
      parentId: commentId,
      createdAt: new Date(),
    };

    updatePost(postId, (post) => ({
      ...post,
      comments: post.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      ),
    }));
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      flair: post.flair || "",
    });
    setIsEditDialogOpen(true);
  };

  const openCommentDialog = (postId: string) => {
    setSelectedPostId(postId);
    setIsCommentDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl pb-20">
      <div className="flex flex-row md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Community</h1>
          <p className="text-xs text-muted-foreground">Share, connect, and support each other</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search posts..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="mb-4"
        />
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <PostFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Create New Post"
        description="Share your thoughts, ask questions, or offer support to the community."
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleAddPost}
        categories={CATEGORIES}
        submitLabel="Post"
      />

      <PostFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Post"
        description="Update your post content below."
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleEditPost}
        categories={CATEGORIES}
        submitLabel="Update"
      />

      <CommentDialog
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        value={commentText}
        onChange={setCommentText}
        onSubmit={handleAddComment}
      />

      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                {searchQuery ? "No posts found matching your search." : "No posts yet. Be the first to share!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={openEditDialog}
              onDelete={handleDeletePost}
              onVote={handleVote}
              onBookmark={handleBookmark}
              onComment={openCommentDialog}
              onReply={handleReply}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
