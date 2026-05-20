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
  image_type : string;
  languages : string | null;
  tools : string | null;
  created_at : string;
};