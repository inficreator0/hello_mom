import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { PostCardSkeleton } from "./ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/bottom-sheet";

const CATEGORIES: CommunityCategory[] = ["All", "Pregnancy", "Postpartum", "Feeding", "Sleep", "Mental Health", "Recovery", "Milestones"];

const Community = () => {
  const { posts, updatePost, refreshPosts, isLoading, hasLoaded, addPost, removePost, hasMore, loadMorePosts, toggleBookmark, currentSort } = usePostsStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Load posts when category changes or on mount
  // Load posts when category changes or on mount
  useEffect(() => {
    // We can rely on the store to handle deduplication or just call it.
    // To be safe against double-mounts in StrictMode, we could use a ref, 
    // but the store's isLoading check should handle it now.
    void refreshPosts(selectedCategory);
  }, [selectedCategory, refreshPosts]);

  // Infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        void loadMorePosts();
      }
    },
    [hasMore, isLoading, loadMorePosts]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
      rootMargin: "20px",
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category is now handled by backend, so we only filter by search query locally
      // Note: effective search would require backend support, this searches only loaded posts
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [posts, searchQuery]);

  const handleAddPost = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const backendPost = await postsAPI.create({
        title: formData.title,
        content: formData.content,
        category: formData.category !== "All" ? formData.category : undefined,
        flair: formData.flair || undefined,
      });

      // Add the new post locally without refetching the entire list
      const newPost = transformPost(backendPost);
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
        category: formData.category !== "All" ? formData.category : undefined,
        flair: formData.flair || undefined,
      });

      // Update the post locally without refetching the entire list
      updatePost(editingPost.id, (post) => {
        return {
          ...post,
          ...transformPost(backendPost),
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

  const handleBookmark = async (postId: string | number) => {
    try {
      await toggleBookmark(postId);
      const post = posts.find(p => String(p.id) === String(postId));
      // Toast logic can be added here if needed, but optimistic UI handles visual feedback
      // Maybe only show toast on error or if user explicitly wants confirmation
    } catch (error: any) {
      showToast(error.message || "Failed to update bookmark", "error");
    }
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

  // Scroll direction detection for sticky header
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // Add threshold to prevent jerky behavior (hysteresis)
      const threshold = 15;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 10) {
        setShowHeader(true);
        lastScrollY.current = currentScrollY;
      } else if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Scrolling down - hide header (if user wants "vanish" on scroll up? No, standard behavior restored)
          // Standard: Scroll Down -> Hide. Scroll Up -> Show.
          setShowHeader(false);
        } else {
          // Scrolling up - show header
          setShowHeader(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Posts are already sorted by backend (createdAt DESC) and store preserves order
  const sortedPosts = filteredPosts;

  return (
    <div className="pb-4">
      {/* Sticky Header Container */}
      <div
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-primary/20 backdrop-blur-md shadow-sm border-b border-primary/20 supports-[backdrop-filter]:bg-primary/10"
          : ""
          }`}
      >
        {/* Header - hides on scroll direction */}
        <div
          className={`container mx-auto px-4 max-w-6xl transition-all duration-300 overflow-hidden ${showHeader ? "max-h-24 opacity-100 pt-8 pb-2" : "max-h-0 opacity-0 pt-0 pb-0"
            }`}
        >
          <div className="flex flex-row md:flex-row justify-between items-start md:items-center mb-2 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Community</h1>
              <p className="text-xs text-muted-foreground">Share, connect, and support each other</p>
            </div>
            <Button onClick={() => navigate("/create-post")}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>

        {/* Search & Categories - always sticky */}
        <div className="container mx-auto px-4 max-w-6xl">
          <SearchBar
            placeholder="Search posts..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="mb-0"
            onFilterClick={() => setIsFilterOpen(true)}
          />
        </div>
      </div>

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent>
          <SheetHeader className="mb-4">
            <SheetTitle>Filter & Sort</SheetTitle>
          </SheetHeader>
          <div className="py-2 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Category</h3>
              <CategoryTabs
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  setIsFilterOpen(false);
                }}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Sort By</h3>
              <div className="flex gap-2">
                <Button
                  variant={currentSort === "recent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (currentSort !== "recent") {
                      refreshPosts(selectedCategory, "recent");
                      setIsFilterOpen(false);
                    }
                  }}
                  className="rounded-full"
                >
                  Latest
                </Button>
                <Button
                  variant={currentSort === "upvotes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (currentSort !== "upvotes") {
                      refreshPosts(selectedCategory, "upvotes");
                      setIsFilterOpen(false);
                    }
                  }}
                  className="rounded-full"
                >
                  Most Upvoted
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="container mx-auto py-4 px-4 max-w-6xl animate-in fade-in-0 slide-in-from-bottom-2 duration-300">

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
          {isLoading && posts.length === 0 ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
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

          {sortedPosts.length > 0 && hasMore && (
            <div ref={observerTarget} className="pt-4 pb-8">
              {isLoading && <PostCardSkeleton />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;

