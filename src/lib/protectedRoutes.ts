import { pages } from "./info";

export const protectedRoutes = pages
  .filter(p => p.requireLogin)
  .map(p => "/" + p.href);