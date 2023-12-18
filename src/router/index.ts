import { Router } from "express";
import authentication from "./authentication";
import files from "./files";

const router = Router();

export default () => {
  authentication(router);
  files(router);
  return router;
};
