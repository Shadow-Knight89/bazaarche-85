
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Reply } from "lucide-react";
import { formatDate } from "../../utils/formatters";
import { Comment as CommentType } from "../../types";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
import { useAppContext } from "../../contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";

interface CommentItemProps {
  comment: CommentType;
  onAddReply: (commentId: string, replyText: string) => void;
}

const CommentItem = ({ comment, onAddReply }: CommentItemProps) => {
  const { user } = useAppContext();
  const { toast } = useToast();
  const [replyingTo, setReplyingTo] = useState<boolean>(false);
  
  const toggleReplyForm = () => {
    if (!user) {
      toast({
        title: "خطا",
        description: "برای ثبت پاسخ ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      return;
    }
    setReplyingTo(!replyingTo);
  };
  
  const handleAddReply = (replyText: string) => {
    onAddReply(comment.id, replyText);
    setReplyingTo(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="font-medium">
              {comment.username}
              {comment.isAdmin && (
                <span className="mr-2 text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                  ادمین
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(comment.createdAt)}
          </div>
        </div>
        
        <p className="mb-4">{comment.text}</p>
        
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleReplyForm}
          >
            <Reply className="ml-1 h-4 w-4" />
            پاسخ
          </Button>
        </div>
        
        {/* Reply form */}
        {replyingTo && user && (
          <ReplyForm 
            onSubmit={handleAddReply}
            onCancel={() => setReplyingTo(false)}
          />
        )}
        
        {/* Replies */}
        {comment.replies.length > 0 && (
          <ReplyList replies={comment.replies} />
        )}
      </CardContent>
    </Card>
  );
};

export default CommentItem;
