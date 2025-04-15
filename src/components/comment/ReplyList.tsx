
import { formatDate } from "../../utils/formatters";
import { Reply } from "../../types";

interface ReplyListProps {
  replies: Reply[];
}

const ReplyList = ({ replies }: ReplyListProps) => {
  return (
    <div className="mt-4 pl-6 border-r-2 border-gray-200">
      {replies.map((reply) => (
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
  );
};

export default ReplyList;
