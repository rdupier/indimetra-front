export interface User {
  id: number;
  username: string;
  email: string;
  profileImage: string;
  socialLinks?: string;
  roles: string;
  active: boolean;
  deleted: boolean;

  // Simulados
  rolAdmin?: boolean;
  autor?: boolean;
}
