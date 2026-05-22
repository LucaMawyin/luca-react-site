export interface Env {
  luca_db: D1Database;
};

export type ProjectResponse = {
  projects : Project[];
}

export type Project= {
  id : number;
  name : string;
  description : string;
  link : string;
  image : Buffer | null;
  image_type : string | null;
  languages : string | null;
  tools : string | null;
  created_at : string;
};

export type User = {
  id: number;
  email: string;
  password: string;
  firstName : string;
  lastName : string;
  createdAt : string; 
  emailVerified : boolean;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type Session = {
  id: number;
  user_id: number;
  token: string;
  created_at: string;
  expires_at: string;
};

export type LoginResponse =
  | { status: "success" ; error : "" }
  | { status: "error"; error: string }
  | { status : "verification_required"; error : "" };

export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};