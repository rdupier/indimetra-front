export interface RegisterRequestDto {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    country?: string;
    roles?: string[]; //Defecto ROLE_USER desde el backend
    socialLinks?: string;
  }