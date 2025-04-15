
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ReplyFormProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

const ReplyForm = ({ onSubmit, onCancel }: ReplyFormProps) => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  
  const handleSubmit = () => {
    if (!text.trim()) {
      toast({
        title: "خطا",
        description: "متن پاسخ نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(text);
    setText("");
  };

  return (
    <div className="mt-4 pl-6 border-r-2 border-gray-200">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="پاسخ خود را بنویسید..."
        className="mb-2"
        rows={2}
      />
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
          onClick={onCancel}
        >
          لغو
        </Button>
        <Button 
          size="sm" 
          onClick={handleSubmit}
        >
          ثبت پاسخ
        </Button>
      </div>
    </div>
  );
};

export default ReplyForm;
