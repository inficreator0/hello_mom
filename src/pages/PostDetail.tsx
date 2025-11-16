import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronUp, ChevronDown, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { usePosts } from "../context/PostsContext";
import { postsAPI, commentsAPI } from "../lib/api";
import CommentDialog from "../components/common/CommentDialog";
import ReplyDialog from "../components/common/ReplyDialog";
import { useState, useEffect } from "react";
import { Comment } from "../types";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, updatePost, refreshPosts } = usePosts();
  const post = id ? getPostById(id) : undefined;

  // Load post details and comments if not already loaded
  useEffect(() => {
    if (id && post) {
      // Post is already loaded, but ensure comments are loaded
      refreshPosts();
    }
  }, [id]);

  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  if (!post) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Post not found</p>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/community")}
            >
              Back to Community
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleVote = (voteType: "up" | "down") => {
    updatePost(post.id as string, (currentPost) => { //TODO: fix this
      const currentVote = currentPost.userVote;
      let newVotes = currentPost.votes;

      if (currentVote === voteType) {
        newVotes += voteType === "up" ? -1 : 1;
        return { ...currentPost, votes: newVotes, userVote: null };
      } else if (currentVote === null) {
        newVotes += voteType === "up" ? 1 : -1;
        return { ...currentPost, votes: newVotes, userVote: voteType };
      } else {
        newVotes += voteType === "up" ? 2 : -2;
        return { ...currentPost, votes: newVotes, userVote: voteType };
      }
    });
  };

  const handleBookmark = () => {
    updatePost(post.id as string, (currentPost) => ({ //TODO: fix this
      ...currentPost,
      bookmarked: !currentPost.bookmarked,
    }));
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;

    try {
      await commentsAPI.create(id, {
        content: commentText,
      });
      
      await refreshPosts();
      setCommentText("");
      setIsCommentDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding comment:", error);
      alert(error.message || "Failed to add comment. Please try again.");
    }
  };

  const handleReply = async (commentId: string | number, replyContent: string) => {
    if (!id) return;

    try {
      await commentsAPI.create(id, {
        content: replyContent,
        parentCommentId: Number(commentId),
      });
      
      await refreshPosts();
      setReplyText("");
      setIsReplyDialogOpen(false);
      setSelectedCommentId(null);
    } catch (error: any) {
      console.error("Error adding reply:", error);
      alert(error.message || "Failed to add reply. Please try again.");
    }
  };

  const openReplyDialog = (commentId: string) => {
    setSelectedCommentId(commentId);
    setIsReplyDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.delete(id);
        navigate("/community");
      } catch (error: any) {
        console.error("Error deleting post:", error);
        alert(error.message || "Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/community")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <CardTitle className="text-base">{post.title}</CardTitle>

                </div>
                <CardDescription className="text-[10px] mb-[4px]">
                  by {post.author} • {formatDate(post.createdAt)}
                  {post.updatedAt ? ` • Updated`: ''}
                </CardDescription>

                {post.flair && <Badge variant="secondary">{post.flair}</Badge>}
                  <Badge variant="outline">{post.category}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  aria-label="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap mb-6 text-sm leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 flex-wrap border-t pt-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleVote("up")}
                  aria-label="Upvote"
                >
                  <ChevronUp
                    className={`h-4 w-4 ${
                      post.userVote === "up" ? "text-primary fill-primary" : ""
                    }`}
                  />
                </Button>
                <span className="font-semibold min-w-[2rem] text-center text-base">
                  {post.votes}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleVote("down")}
                  aria-label="Downvote"
                >
                  <ChevronDown
                    className={`h-4 w-4 ${
                      post.userVote === "down" ? "text-destructive fill-destructive" : ""
                    }`}
                  />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommentDialogOpen(true)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                aria-label={post.bookmarked ? "Unbookmark" : "Bookmark"}
              >
                {post.bookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Comments ({post.comments.length})
            </h2>
          </div>

          {post.comments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              </CardContent>
            </Card>
          ) : (
            post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                formatDate={formatDate}
                onReply={openReplyDialog}
              />
            ))
          )}
        </div>

        <CommentDialog
          open={isCommentDialogOpen}
          onOpenChange={setIsCommentDialogOpen}
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleAddComment}
        />

        {selectedCommentId && (
          <ReplyDialog
            open={isReplyDialogOpen}
            onOpenChange={setIsReplyDialogOpen}
            replyingTo={post.comments.find((c) => c.id === selectedCommentId)?.author}
            value={replyText}
            onChange={setReplyText}
            onSubmit={() => selectedCommentId && handleReply(selectedCommentId, replyText)}
          />
        )}
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  formatDate,
  onReply,
}: {
  comment: Comment;
  formatDate: (date: Date | string) => string;
  onReply: (commentId: string) => void;
}) => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { refreshPosts } = usePosts();

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      await commentsAPI.create(String(comment.postId), {
        content: replyText,
        parentCommentId: Number(comment.id),
      });
      
      // Refresh to get updated comments
      await refreshPosts();
      setReplyText("");
      setIsReplyDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding reply:", error);
      alert(error.message || "Failed to add reply. Please try again.");
    }
  };

  const totalReplies = comment.replies?.length || 0;

  return (
    <>
      <Card>
        <CardContent className="pt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm font-semibold">{comment.author}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>
            <p className="text-sm mb-3">{comment.content}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsReplyDialogOpen(true)}
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              Reply {totalReplies > 0 && `(${totalReplies})`}
            </Button>
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-4 space-y-3 border-l-2 border-primary/20 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-background/70 rounded-md p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-medium">{reply.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(reply.createdAt)}
                      </p>
                    </div>
                    <p className="text-xs">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ReplyDialog
        open={isReplyDialogOpen}
        onOpenChange={setIsReplyDialogOpen}
        replyingTo={comment.author}
        value={replyText}
        onChange={setReplyText}
        onSubmit={handleReplySubmit}
      />
    </>
  );
};

export default PostDetail;

