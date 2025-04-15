
import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { formatDate } from "../utils/formatters";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Comment as CommentType } from "../types";
import { MessageSquare, Reply } from "lucide-react";

interface CommentSectionProps {
  productId: string;
}

const CommentSection = ({ productId }: CommentSectionProps) => {
  const { user, addComment, addReply, getCommentsForProduct } = useAppContext();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  
  // Fetch comments when component mounts or productId changes
  useEffect(() => {
    // Get initial comments
    const initialComments = getCommentsForProduct(productId);
    setComments(initialComments);
    
    // Set up an interval to periodically refresh comments
    const intervalId = setInterval(() => {
      const refreshedComments = getCommentsForProduct(productId);
      setComments(refreshedComments);
    }, 5000); // Refresh every 5 seconds
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [productId, getCommentsForProduct]);

  const handleAddComment = () => {
    if (!user) {
      toast({
        title: "خطا",
        description: "برای ثبت نظر ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      return;
    }
    
    if (!commentText.trim()) {
      toast({
        title: "خطا",
        description: "متن نظر نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }
    
    addComment(productId, commentText);
    setCommentText("");
    
    // Refresh comments after adding a new one
    setTimeout(() => {
      const refreshedComments = getCommentsForProduct(productId);
      setComments(refreshedComments);
    }, 500);
  };
  
  const handleAddReply = (commentId: string) => {
    if (!user) {
      toast({
        title: "خطا",
        description: "برای ثبت پاسخ ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      return;
    }
    
    const reply = replyText[commentId];
    
    if (!reply || !reply.trim()) {
      toast({
        title: "خطا",
        description: "متن پاسخ نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }
    
    addReply(commentId, reply);
    setReplyText(prev => ({ ...prev, [commentId]: "" }));
    setReplyingTo(null);
    
    // Refresh comments after adding a reply
    setTimeout(() => {
      const refreshedComments = getCommentsForProduct(productId);
      setComments(refreshedComments);
    }, 500);
  };
  
  const toggleReplyForm = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">نظرات کاربران</h2>
      
      {user ? (
        <div className="mb-8">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="نظر خود را بنویسید..."
            className="mb-4"
            rows={4}
          />
          <Button onClick={handleAddComment}>
            <MessageSquare className="ml-2 h-4 w-4" />
            ثبت نظر
          </Button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 border rounded-md text-center">
          <p>برای ثبت نظر لطفا ابتدا وارد حساب کاربری خود شوید.</p>
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>هنوز نظری برای این محصول ثبت نشده است.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id}>
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
                  {user && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleReplyForm(comment.id)}
                    >
                      <Reply className="ml-1 h-4 w-4" />
                      پاسخ
                    </Button>
                  )}
                </div>
                
                {/* Reply form */}
                {replyingTo === comment.id && user && (
                  <div className="mt-4 pl-6 border-r-2 border-gray-200">
                    <Textarea
                      value={replyText[comment.id] || ""}
                      onChange={(e) => setReplyText({...replyText, [comment.id]: e.target.value})}
                      placeholder="پاسخ خود را بنویسید..."
                      className="mb-2"
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => setReplyingTo(null)}
                      >
                        لغو
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddReply(comment.id)}
                      >
                        ثبت پاسخ
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 border-r-2 border-gray-200">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="mb-4 last:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {reply.username}
                              {reply.isAdmin && (
                                <span className="mr-2 text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                  ادمین
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(reply.createdAt)}
                          </div>
                        </div>
                        <p>{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
