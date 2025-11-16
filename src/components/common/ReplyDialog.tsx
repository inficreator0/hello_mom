import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyingTo?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
}

const ReplyDialog = ({
  open,
  onOpenChange,
  replyingTo,
  value,
  onChange,
  onSubmit,
  submitLabel = "Reply",
  cancelLabel = "Cancel",
  placeholder = "Write your reply here...",
}: ReplyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
          <DialogDescription>
            {replyingTo ? `Replying to ${replyingTo}` : "Share your response to this comment."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reply">Reply</Label>
            <Textarea
              id="reply"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;

