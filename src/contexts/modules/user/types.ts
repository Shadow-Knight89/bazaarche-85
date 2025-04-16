
import { User, SecurityQuestion } from "../../../types";

export interface UserContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, securityQuestion: SecurityQuestion) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  resetPassword: (username: string, newPassword: string) => void;
  getUserSecurityQuestion: (username: string) => string | null;
  verifySecurityAnswer: (username: string, answer: string) => boolean;
  checkLoginRateLimit: () => { limited: boolean; remainingTime: number };
  deleteUser: (userId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  addAdmin: (userId: string) => void;
  updateAdminPermissions: (userId: string, permissions: Partial<User['adminPermissions']>) => void;
}
