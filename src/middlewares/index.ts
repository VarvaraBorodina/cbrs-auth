import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (req: any, res: any, next: any) => {
  try {
    const sessionToken = req.headers["auth"];
    if (!sessionToken) {
      res.status(403).json("unauthorized").end();
      return;
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      res.status(403).json("unauthorized").end();
      return;
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
