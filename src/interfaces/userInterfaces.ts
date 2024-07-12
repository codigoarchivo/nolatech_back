
export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile_image: string | null;
  is_active?: boolean;
  is_admin?: boolean;
  created_at?: Date;
}
