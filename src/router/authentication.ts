import { login, logout, register } from "../controllers/authentication";
import { Router } from "express";

export default (router: Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.put("/auth/logout", logout);
};