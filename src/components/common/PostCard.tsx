import {
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Reply,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Post, Comment } from "../../types";
import { useState } from "react";
import ReplyDialog from "./ReplyDialog";

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string | number) => void;
  onVote?: (postId: string | number, voteType: "up" | "down") => void;
  onBookmark?: (postId: string | number) => void;
  onComment?: (postId: string | number) => void;
  onReply?: (
    postId: string | number,
    commentId: string | number,
    replyContent: string
  ) => void;
  formatDate?: (date: Date | string) => string;
  showActions?: boolean;
}

const PostCard = ({
  post,
  onEdit,
  onDelete,
  onVote,
  onBookmark,
  onComment,
  onReply,
  formatDate,
  showActions = true,
}: PostCardProps) => {
  const [commentsOpen, setCommentsOpen] = useState(false);

  const defaultFormatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const format = formatDate || defaultFormatDate;
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest('[role="button"]')) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">{post.title}</CardTitle>
            </div>

            <CardDescription className="text-[10px] mb-[4px]">
              by {post.author} • {format(post.createdAt)}
              {post.updatedAt && <span> • Updated</span>}
            </CardDescription>
            {post.flair && <Badge variant="secondary">{post.flair}</Badge>}
            <Badge variant="outline">{post.category}</Badge>
          </div>

          {showActions && (
            <div className="flex">
              {onEdit && (
                <Button variant="ghost" size="icon" onClick={() => onEdit(post)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="whitespace-pre-wrap mb-4 text-sm">{post.content}</p>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Voting */}
          {onVote && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onVote(post.id, "up")}>
                <ChevronUp
                  className={`h-5 w-5 ${
                    post.userVote === "up" ? "text-primary fill-primary" : ""
                  }`}
                />
              </Button>

              <span className="font-semibold min-w-[2rem] text-center">
                {post.votes}
              </span>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onVote(post.id, "down")}>
                <ChevronDown
                  className={`h-5 w-5 ${
                    post.userVote === "down" ? "text-destructive fill-destructive" : ""
                  }`}
                />
              </Button>
            </div>
          )}

          {/* Comment Button */}
          {onComment && (
            <Button variant="ghost" size="sm" onClick={() => onComment(post.id)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              {post.comments.length}
            </Button>
          )}

          {/* Bookmark */}
          {onBookmark && (
            <Button variant="ghost" size="icon" onClick={() => onBookmark(post.id)}>
              {post.bookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>

      {/* COLLAPSIBLE COMMENTS */}
      {post.comments.length > 0 && (
        <CardFooter className="flex-col items-start pt-0 pb-2">
          <button
            className="text-sm text-primary font-medium flex items-center gap-1 py-2"
            onClick={() => setCommentsOpen(!commentsOpen)}
          >
            {commentsOpen ? "Hide Comments" : "Show Comments"} ({post.comments.length})
            {commentsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

    
        </CardFooter>
      )}
           {/* COLLAPSIBLE PANEL */}
           <div
            className={`transition-all overflow-hidden ${
              commentsOpen ? "max-h-[1000px] opacity-100 p-4" : "max-h-0 opacity-0 "
            }`}
          >
            <div className="w-full border-t pt-4 space-y-3">
              {post.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  formatDate={format}
                  postId={post.id}
                  onReply={onReply}
                />
              ))}
            </div>
          </div>
    </Card>
  );
};

/* ---------------------------------------------
   COMMENT ITEM
---------------------------------------------- */
const CommentItem = ({
  comment,
  formatDate,
  postId,
  onReply,
}: {
  comment: Comment;
  formatDate: (date: Date | string) => string;
  postId: string | number;
  onReply?: (
    postId: string | number,
    commentId: string | number,
    replyContent: string
  ) => void;
}) => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const submitReply = () => {
    if (!replyText.trim() || !onReply) return;
    onReply(postId, String(comment.id), replyText);
    setReplyText("");
    setIsReplyDialogOpen(false);
  };

  const totalReplies = comment.replies?.length || 0;

  return (
    <>
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-medium">{comment.author}</p>
          <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
        </div>

        <p className="text-sm mb-2">{comment.content}</p>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setIsReplyDialogOpen(true)}
        >
          <Reply className="mr-1 h-3 w-3" />
          Reply {totalReplies > 0 && `(${totalReplies})`}
        </Button>

        {totalReplies > 0 && (
          <div className="mt-3 ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="bg-background/50 rounded-md p-2">
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

      <ReplyDialog
        open={isReplyDialogOpen}
        onOpenChange={setIsReplyDialogOpen}
        replyingTo={comment.author}
        value={replyText}
        onChange={setReplyText}
        onSubmit={submitReply}
      />
    </>
  );
};

export default PostCard;
