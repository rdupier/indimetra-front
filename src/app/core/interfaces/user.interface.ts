export interface User {
  id: number;
  username: string;
  email: string;
  profileImage: string;
  socialLinks?: string;
  country?: string;

  roles: string;
  active: boolean;
  deleted: boolean;

  rolAdmin?: boolean;
  autor?: boolean;
}

