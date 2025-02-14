export type UserRole = 'user' | 'researcher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserActivity {
  type: 'user_deleted' | 'user_role_updated';
  description: string;
  created_at: string;
} 