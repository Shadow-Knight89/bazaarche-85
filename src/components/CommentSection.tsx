
import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Comment as CommentType } from "../types";
import CommentForm from "./comment/CommentForm";
import CommentList from "./comment/CommentList";

interface CommentSectionProps {
  productId: string;
}

const CommentSection = ({ productId }: CommentSectionProps) => {
  const { user, addComment, addReply, getCommentsForProduct } = useAppContext();
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

  const handleAddComment = (commentText: string) => {
    addComment(productId, commentText);
    
    // Refresh comments after adding a new one
    setTimeout(() => {
      const refreshedComments = getCommentsForProduct(productId);
      setComments(refreshedComments);
    }, 500);
  };
  
  const handleAddReply = (commentId: string, replyText: string) => {
    addReply(commentId, replyText);
    
    // Refresh comments after adding a reply
    setTimeout(() => {
      const refreshedComments = getCommentsForProduct(productId);
      setComments(refreshedComments);
    }, 500);
  };
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">نظرات کاربران</h2>
      
      <CommentForm 
        onSubmit={handleAddComment}
        isLoggedIn={!!user}
      />
      
      <CommentList 
        comments={comments} 
        onAddReply={handleAddReply}
      />
    </div>
  );
};

export default CommentSection;
