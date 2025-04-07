export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // no lo enviamos al backend
  profileImage?: string;
  country?: string;
  roles?: string[];
  socialLinks?: string;
}
