import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Post, PostFormData, Comment, CommunityCategory } from "../types";
import { postsAPI, commentsAPI } from "../lib/api/posts";
import SearchBar from "./common/SearchBar";
import PostCard from "./common/PostCard";
import PostFormDialog from "./common/PostFormDialog";
import CommentDialog from "./common/CommentDialog";
import CategoryTabs from "./common/CategoryTabs";
import { usePostsStore, transformPost } from "../store/postsStore";
import { useToast } from "../context/ToastContext";
import Loader from "./common/Loader";

const CATEGORIES: CommunityCategory[] = ["All", "Pregnancy", "Postpartum", "Feeding", "Sleep", "Mental Health", "Recovery", "Milestones"];

const Community = () => {
  const { posts, updatePost, refreshPosts, isLoading, hasLoaded, addPost, removePost } = usePostsStore();
  const { showToast } = useToast();

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

  // Load posts when the Community page mounts (only if not already loaded)
  useEffect(() => {
    if (!hasLoaded) {
      void refreshPosts();
    }
  }, [hasLoaded, refreshPosts]);

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
      const backendPost = await postsAPI.create({
        title: formData.title,
        content: formData.content,
      });

      // Add the new post locally without refetching the entire list
      const newPost = {
        ...transformPost(backendPost),
        category: formData.category,
      };
      addPost(newPost);

      setFormData({ title: "", content: "", category: "All", flair: "" });
      setIsAddDialogOpen(false);
      showToast("Post created successfully", "success");
    } catch (error: any) {
      console.error("Error creating post:", error);
      showToast(error.message || "Failed to create post. Please try again.", "error");
    }
  };

  const handleEditPost = async () => {
    if (!editingPost || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const backendPost = await postsAPI.update(String(editingPost.id), {
        title: formData.title,
        content: formData.content,
      });

      // Update the post locally without refetching the entire list
      updatePost(editingPost.id, (post) => {
        return {
          ...post,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          updatedAt: backendPost.updatedAt
            ? new Date(backendPost.updatedAt)
            : new Date(),
        };
      });

      setEditingPost(null);
      setFormData({ title: "", content: "", category: "All", flair: "" });
      setIsEditDialogOpen(false);
      showToast("Post updated", "success");
    } catch (error: any) {
      console.error("Error updating post:", error);
      showToast(error.message || "Failed to update post. Please try again.", "error");
    }
  };

  const handleDeletePost = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.delete(String(id));
        removePost(id);
        showToast("Post deleted", "success");
      } catch (error: any) {
        console.error("Error deleting post:", error);
        showToast(error.message || "Failed to delete post. Please try again.", "error");
      }
    }
  };

  const handleVote = async (postId: string | number, voteType: "up" | "down") => {
    const postIdStr = String(postId);
    const currentPost = posts.find((p) => String(p.id) === postIdStr);
    if (!currentPost) return;

    const previousVote = currentPost.userVote;
    const previousVotes = currentPost.votes;

    // Optimistic UI update
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

    // Persist vote to backend; rollback on failure
    try {
      if (voteType === "up") {
        await postsAPI.upvote(postIdStr);
      } else {
        await postsAPI.downvote(postIdStr);
      }
    } catch (error: any) {
      console.error("Error updating vote:", error);
      // Roll back optimistic update
      updatePost(postId, (post) => ({
        ...post,
        votes: previousVotes,
        userVote: previousVote ?? null,
      }));
      alert(error.message || "Failed to update vote. Please try again.");
    }
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
    return new Intl.DateTimeFormat("en-IN", {
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background pb-20">
      <div className="container mx-auto py-8 px-4 max-w-6xl animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <div className="flex flex-row md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Community</h1>
          <p className="text-xs text-muted-foreground">Share, connect, and support each other</p>
        </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 delay-75">
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
            <CardContent className="pt-4">
              <Loader label="Fetching community posts..." />
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
    </div>
  );
};

export default Community;

