import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModal = mongoose.model("User", UserSchema);

export const getUserByEmail = (email: string) => UserModal.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModal.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const createUser = (values: Record<string, any>) =>
  new UserModal(values).save().then((user) => user.toObject());
