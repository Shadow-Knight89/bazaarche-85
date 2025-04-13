
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState<"username" | "security" | "reset">("username");
  const [username, setUsername] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const navigate = useNavigate();
  const { getUserSecurityQuestion, verifySecurityAnswer, resetPassword } = useAppContext();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = getUserSecurityQuestion(username);
    
    if (question) {
      setSecurityQuestion(question);
      setStep("security");
    } else {
      toast({
        title: "خطا",
        description: "نام کاربری یافت نشد یا سوال امنیتی برای این حساب تنظیم نشده است",
        variant: "destructive",
      });
    }
  };

  const handleSecurityAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isCorrect = verifySecurityAnswer(username, securityAnswer);
    
    if (isCorrect) {
      setStep("reset");
    } else {
      toast({
        title: "خطا",
        description: "پاسخ سوال امنیتی صحیح نیست",
        variant: "destructive",
      });
    }
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور و تکرار آن باید یکسان باشند",
        variant: "destructive",
      });
      return;
    }
    
    resetPassword(username, newPassword);
    
    toast({
      title: "بازیابی موفق",
      description: "رمز عبور شما با موفقیت تغییر کرد",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">بازیابی رمز عبور</CardTitle>
          <CardDescription className="text-center">
            {step === "username" && "نام کاربری خود را وارد کنید"}
            {step === "security" && "به سوال امنیتی خود پاسخ دهید"}
            {step === "reset" && "رمز عبور جدیدی انتخاب کنید"}
          </CardDescription>
        </CardHeader>
        
        {step === "username" && (
          <form onSubmit={handleUsernameSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  نام کاربری
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="نام کاربری خود را وارد کنید"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2 space-s-2">
              <Link to="/login">
                <Button variant="outline" type="button">بازگشت</Button>
              </Link>
              <Button type="submit">ادامه</Button>
            </CardFooter>
          </form>
        )}
        
        {step === "security" && (
          <form onSubmit={handleSecurityAnswerSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  سوال امنیتی
                </label>
                <p className="p-3 bg-muted rounded-md">{securityQuestion}</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="securityAnswer" className="text-sm font-medium">
                  پاسخ
                </label>
                <Input
                  id="securityAnswer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                  placeholder="پاسخ سوال امنیتی را وارد کنید"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2 space-s-2">
              <Button variant="outline" type="button" onClick={() => setStep("username")}>
                بازگشت
              </Button>
              <Button type="submit">ادامه</Button>
            </CardFooter>
          </form>
        )}
        
        {step === "reset" && (
          <form onSubmit={handlePasswordResetSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  رمز عبور جدید
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="رمز عبور جدید را وارد کنید"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  تکرار رمز عبور جدید
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="رمز عبور جدید را مجدداً وارد کنید"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2 space-s-2">
              <Button variant="outline" type="button" onClick={() => setStep("security")}>
                بازگشت
              </Button>
              <Button type="submit">تغییر رمز عبور</Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
