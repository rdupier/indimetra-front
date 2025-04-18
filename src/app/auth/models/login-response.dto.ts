import { User } from "../../core/interfaces/user.interface";

export interface LoginResponse {
  message: string;
  user: User;
  token?: string;
}
