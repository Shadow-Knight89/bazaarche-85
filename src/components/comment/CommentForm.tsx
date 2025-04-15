
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  isLoggedIn: boolean;
}

const CommentForm = ({ onSubmit, isLoggedIn }: CommentFormProps) => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  
  const handleSubmit = () => {
    if (!isLoggedIn) {
      toast({
        title: "خطا",
        description: "برای ثبت نظر ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      return;
    }
    
    if (!text.trim()) {
      toast({
        title: "خطا",
        description: "متن نظر نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(text);
    setText("");
  };

  if (!isLoggedIn) {
    return (
      <div className="mb-8 p-4 bg-gray-50 border rounded-md text-center">
        <p>برای ثبت نظر لطفا ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="نظر خود را بنویسید..."
        className="mb-4"
        rows={4}
      />
      <Button onClick={handleSubmit}>
        <MessageSquare className="ml-2 h-4 w-4" />
        ثبت نظر
      </Button>
    </div>
  );
};

export default CommentForm;
