import {
  addFile,
  deleteFile,
  editFile,
  getFilesList,
  readFile,
} from "../controllers/files";
import { Router } from "express";
import { isAuthenticated } from "../middlewares";

export default (router: Router) => {
  router.get("/files", isAuthenticated, getFilesList);

  router.post("/file", isAuthenticated, addFile);
  router.get("/file", isAuthenticated, readFile);
  router.put("/file", isAuthenticated, editFile);
  router.delete("/file", isAuthenticated, deleteFile);
};
