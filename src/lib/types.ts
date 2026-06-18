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
  image : string | null;
  image_type : string | null;
  languages : string | null;
  tools : string | null;
  libraries: string | null;
  created_at : string;
  tag:string;
  pinned: 1 | 0;
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

export type ChangePasswordResponse =
  | { success: true ; error : "" }
  | { success: false; error: string };

export type VerifyLoginBody = {
  code: string;
};


export type Page = {
  title: string;
  href: string;
  section?: string;
  requireLogin: boolean;
  mobile?: boolean;
  newTab?: boolean;
};

export type Tag = {
  id: number;
  name: string;
  builtin: boolean;
  category: "projects" | "experience"
}

export type Tech = {
  id: number; 
  name: string;
  category: "tools" | "libraries" | "languages";
}

export type TechBody = {
  languages: string;
  tools: string;
  libraries: string;
};

export type Experience = {
  id:number;
  title:string;
  description:string;
  tag:string;
  city:string;
  region:string;
  start_date:string;
  end_date?:string;
  company:string;
}