import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Post, PostFormData, Comment, CommunityCategory } from "../types";
import { usePosts } from "../context/PostsContext";
import { postsAPI, commentsAPI } from "../lib/api";
import SearchBar from "./common/SearchBar";
import PostCard from "./common/PostCard";
import PostFormDialog from "./common/PostFormDialog";
import CommentDialog from "./common/CommentDialog";
import CategoryTabs from "./common/CategoryTabs";

const CATEGORIES: CommunityCategory[] = ["All", "Pregnancy", "Postpartum", "Feeding", "Sleep", "Mental Health", "Recovery", "Milestones"];

const Community = () => {
  const { posts, setPosts, updatePost, refreshPosts, isLoading } = usePosts();

  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null);
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

  const handleAddPost = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const response = await postsAPI.create({
        title: formData.title,
        content: formData.content,
      });
      
      // Refresh posts to get the new post with all data
      await refreshPosts();
      setFormData({ title: "", content: "", category: "All", flair: "" });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating post:", error);
      alert(error.message || "Failed to create post. Please try again.");
    }
  };

  const handleEditPost = async () => {
    if (!editingPost || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      await postsAPI.update(String(editingPost.id), {
        title: formData.title,
        content: formData.content,
      });
      
      // Refresh posts to get updated data
      await refreshPosts();
      setEditingPost(null);
      setFormData({ title: "", content: "", category: "All", flair: "" });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating post:", error);
      alert(error.message || "Failed to update post. Please try again.");
    }
  };

  const handleDeletePost = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.delete(String(id));
        await refreshPosts();
      } catch (error: any) {
        console.error("Error deleting post:", error);
        alert(error.message || "Failed to delete post. Please try again.");
      }
    }
  };

  const handleVote = (postId: string | number, voteType: "up" | "down") => {
    updatePost(postId as string, (post) => { //TODO: fix this
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

  const handleBookmark = (postId: string | number) => {
    updatePost(postId as string, (post) => ({ //TODO: fix this
      ...post,
      bookmarked: !post.bookmarked,
    }));
  };

  const handleAddComment = async () => {
    if (!selectedPostId || !commentText.trim()) return;

    try {
      await commentsAPI.create(String(selectedPostId), {
        content: commentText,
      });
      
      // Refresh posts to get updated comments
      await refreshPosts();
      setCommentText("");
      setIsCommentDialogOpen(false);
      setSelectedPostId(null);
    } catch (error: any) {
      console.error("Error adding comment:", error);
      alert(error.message || "Failed to add comment. Please try again.");
    }
  };

  const handleReply = async (postId: string | number, commentId: string | number, replyContent: string) => {
    try {
      await commentsAPI.create(String(postId), {
        content: replyContent,
        parentCommentId: Number(commentId),
      });
      
      // Refresh posts to get updated comments
      await refreshPosts();
    } catch (error: any) {
      console.error("Error adding reply:", error);
      alert(error.message || "Failed to add reply. Please try again.");
    }
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

  const openCommentDialog = (postId: string | number) => {
    setSelectedPostId(postId);
    setIsCommentDialogOpen(true);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    const dateA = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : a.createdAt.getTime();
    const dateB = typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : b.createdAt.getTime();
    return dateB - dateA;
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
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading posts...</p>
            </CardContent>
          </Card>
        ) : sortedPosts.length === 0 ? (
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
