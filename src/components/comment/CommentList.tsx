
import { Comment as CommentType } from "../../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentType[];
  onAddReply: (commentId: string, replyText: string) => void;
}

const CommentList = ({ comments, onAddReply }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>هنوز نظری برای این محصول ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment}
          onAddReply={onAddReply}
        />
      ))}
    </div>
  );
};

export default CommentList;
