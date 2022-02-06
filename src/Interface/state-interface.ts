import { Auth } from "./auth-interface";

export interface State {
  auth?: Auth;
  loading?: boolean;
  user?: {
    id: number;
    username: string;
  };
  username?: string;
  isActive?: boolean;
}
