import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronUp, ChevronDown, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { usePosts } from "../context/PostsContext";
import CommentDialog from "../components/common/CommentDialog";
import ReplyDialog from "../components/common/ReplyDialog";
import { useState } from "react";
import { Comment } from "../types";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, updatePost, setPosts } = usePosts();
  const post = id ? getPostById(id) : undefined;

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleVote = (voteType: "up" | "down") => {
    updatePost(post.id, (currentPost) => {
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
    updatePost(post.id, (currentPost) => ({
      ...currentPost,
      bookmarked: !currentPost.bookmarked,
    }));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      author: "You",
      postId: post.id,
      createdAt: new Date(),
      replies: [],
    };

    updatePost(post.id, (currentPost) => ({
      ...currentPost,
      comments: [...currentPost.comments, newComment],
    }));

    setCommentText("");
    setIsCommentDialogOpen(false);
  };

  const handleReply = (commentId: string, replyContent: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      content: replyContent,
      author: "You",
      postId: post.id,
      parentId: commentId,
      createdAt: new Date(),
    };

    updatePost(post.id, (currentPost) => ({
      ...currentPost,
      comments: currentPost.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      ),
    }));

    setReplyText("");
    setIsReplyDialogOpen(false);
    setSelectedCommentId(null);
  };

  const openReplyDialog = (commentId: string) => {
    setSelectedCommentId(commentId);
    setIsReplyDialogOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      navigate("/community");
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
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  {post.flair && <Badge variant="secondary">{post.flair}</Badge>}
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardDescription className="text-sm">
                  by {post.author} • {formatDate(post.createdAt)}
                  {post.updatedAt && ` • Updated ${formatDate(post.updatedAt)}`}
                </CardDescription>
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
            <p className="whitespace-pre-wrap mb-6 text-base leading-relaxed">{post.content}</p>
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
                    className={`h-5 w-5 ${
                      post.userVote === "up" ? "text-primary fill-primary" : ""
                    }`}
                  />
                </Button>
                <span className="font-semibold min-w-[2rem] text-center text-lg">
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
                    className={`h-5 w-5 ${
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
                  <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
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
            onSubmit={() => handleReply(selectedCommentId, replyText)}
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
  formatDate: (date: Date) => string;
  onReply: (commentId: string) => void;
}) => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { updatePost } = usePosts();

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      const newReply: Comment = {
        id: Date.now().toString(),
        content: replyText,
        author: "You",
        postId: comment.postId,
        parentId: comment.id,
        createdAt: new Date(),
      };

      updatePost(comment.postId, (currentPost) => ({
        ...currentPost,
        comments: currentPost.comments.map((c) =>
          c.id === comment.id
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        ),
      }));

      setReplyText("");
      setIsReplyDialogOpen(false);
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

