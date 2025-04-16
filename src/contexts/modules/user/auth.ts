
import { toast } from '@/components/ui/use-toast';
import { configureAxiosCSRF } from '../../../utils/api/base';
import { loginUser, logoutUser, registerUser } from '../../../utils/api';
import { User, LoginAttempt, SecurityQuestion } from '../../../types';

export const handleLogin = async (
  username: string, 
  password: string,
  loginAttempts: LoginAttempt[],
  setLoginAttempts: React.Dispatch<React.SetStateAction<LoginAttempt[]>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<boolean> => {
  try {
    // Configure CSRF token before making login request
    await configureAxiosCSRF();
    
    const userData = await loginUser(username, password);
    
    if (userData) {
      const loggedInUser: User = {
        id: userData.id.toString(),
        username: userData.username,
        password: '',
        isAdmin: username === 'admin',
        canComment: true
      };
      
      setUser(loggedInUser);
      
      setLoginAttempts(prev => 
        prev.map(attempt => 
          attempt.ip === "current-ip" ? { ...attempt, count: 0 } : attempt
        )
      );
      
      return true;
    }
    
    return false;
  } catch (error) {
    const currentAttempt = loginAttempts.find(a => a.ip === "current-ip");
    
    if (currentAttempt) {
      setLoginAttempts(prev => 
        prev.map(attempt => 
          attempt.ip === "current-ip" 
            ? { 
                ...attempt, 
                count: attempt.count + 1, 
                timestamp: Date.now() 
              } 
            : attempt
        )
      );
    } else {
      setLoginAttempts(prev => [
        ...prev,
        { ip: "current-ip", count: 1, timestamp: Date.now() }
      ]);
    }
    
    return false;
  }
};

export const handleRegister = async (
  username: string, 
  password: string, 
  securityQuestion: SecurityQuestion,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
): Promise<boolean> => {
  try {
    const userData = await registerUser({
      username,
      password,
    });
    
    if (userData) {
      const newUser: User = {
        id: userData.id.toString(),
        username: userData.username,
        password: '',
        isAdmin: false,
        securityQuestion,
        canComment: true
      };
      
      setUsers(prev => [...prev, newUser]);
      
      toast({
        title: "ثبت نام موفق",
        description: "حساب کاربری با موفقیت ایجاد شد",
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};

export const handleLogout = async (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<void> => {
  try {
    // Configure CSRF token before making logout request
    await configureAxiosCSRF();
    await logoutUser();
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    setUser(null);
  }
};
