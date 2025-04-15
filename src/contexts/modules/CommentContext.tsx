
import React, { createContext, useContext, useState } from "react";
import { Comment } from "../../types";
import { useUserContext } from "./UserContext";
import { toast } from "@/components/ui/use-toast";
import { postComment, fetchComments } from "../../utils/api";

interface CommentContextType {
  addComment: (productId: string, text: string) => void;
  addReply: (commentId: string, text: string) => void;
  getCommentsForProduct: (productId: string) => Comment[];
}

const CommentContext = createContext<CommentContextType>({} as CommentContextType);

export const useCommentContext = () => useContext(CommentContext);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = async (productId: string, text: string) => {
    if (!user) return;
    
    try {
      const commentData = {
        product: productId,
        text
      };
      
      const response = await postComment(commentData);
      
      if (response) {
        const newComment: Comment = {
          id: response.id,
          productId,
          userId: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          adminPrefix: user.isAdmin && user.adminPermissions?.customPrefix,
          adminPrefixColor: user.isAdmin && user.adminPermissions?.customPrefixColor,
          text,
          createdAt: response.createdAt || new Date().toISOString(),
          replies: []
        };
        
        setComments(prev => [...prev, newComment]);
        
        toast({
          title: "نظر جدید",
          description: "نظر شما با موفقیت ثبت شد",
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  const addReply = (commentId: string, text: string) => {
    if (!user) return;
    
    const reply = {
      id: Date.now().toString(),
      commentId,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      adminPrefix: user.isAdmin && user.adminPermissions?.customPrefix,
      adminPrefixColor: user.isAdmin && user.adminPermissions?.customPrefixColor,
      text,
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] } 
          : comment
      )
    );
  };
  
  const getCommentsForProduct = (productId: string) => {
    // Filter from local state first
    const productComments = comments.filter(comment => comment.productId === productId);
    
    // Load comments from API in the background
    fetchComments(productId)
      .then(commentsData => {
        if (commentsData && Array.isArray(commentsData)) {
          // Transform API response to our Comment format
          const formattedComments: Comment[] = commentsData.map((comment: any) => ({
            id: comment.id.toString(),
            productId: typeof comment.product === 'object' ? comment.product.id.toString() : comment.product.toString(),
            userId: comment.user?.id?.toString() || "unknown",
            username: comment.user?.username || "unknown",
            isAdmin: comment.user?.is_superuser || false,
            text: comment.text,
            createdAt: comment.createdAt || comment.created_at || new Date().toISOString(),
            replies: [], // API doesn't support replies yet
          }));
          
          // Update local state
          setComments(prevComments => {
            // Merge with existing comments, avoiding duplicates
            const existingIds = new Set(prevComments.map(c => c.id));
            const newComments = formattedComments.filter(c => !existingIds.has(c.id));
            return [...prevComments, ...newComments];
          });
        }
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
    
    // Return the currently known comments immediately
    return productComments;
  };

  const value = {
    addComment,
    addReply,
    getCommentsForProduct
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};
