import { createUser, getUserByEmail, getUserBySessionToken } from "../db/users";
import { authentication, random } from "../helpers";

export const register = async (req: any, res: any) => {
  try {
    const { email, password, username } = req.body as Record<string, string>;

    if (!email || !password || !username) {
      res.status(400).json("invalid data").end();
      return;
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json("user already exist").end();
      return;
    }

    const passwordSalt = random();
    const tokenSalt = random();

    const sessionToken = authentication(tokenSalt, email);
    await createUser({
      email,
      username,
      authentication: {
        salt: passwordSalt,
        password: authentication(passwordSalt, password),
        sessionToken: sessionToken,
      },
    });

    res.status(201).json({ user: { email, username }, sessionToken }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json("invalid data").end();
      return;
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      res.status(400).json("user doesn't exist").end();
      return;
    }

    const expextedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password != expextedHash) {
      res.status(403).json("wrong password").end();
      return;
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res
      .status(200)
      .json({
        sessionToken: user.authentication.sessionToken,
        username: user.username,
        email: user.email,
      });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: any, res: any) => {
  try {
    const sessionToken = req.headers["auth"];
    if (!sessionToken) {
      res.status(403).json("unauthorized").end();
      return;
    }

    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      res.status(403).json("unauthorized").end();
      return;
    }

    user.authentication.sessionToken = undefined;
    await user.save();

    res.cookie(200).json("log out");
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
