export interface User {
  username: string;
  email: string;
  profileImage: string;
  roles: string[];
  isAuthor?: boolean;
  country?: string;
  socialLinks?: string;
}
