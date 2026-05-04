import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User, IUser } from "../models/User";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "member";
};

const toRecord = (doc: IUser): UserRecord => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  password_hash: doc.password_hash,
  role: doc.role
});

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signAccessToken = (user: { id: string; role: "admin" | "member" }) => {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const getUserByEmail = async (email: string) => {
  const doc = await User.findOne({ email: email.toLowerCase() });
  return doc ? toRecord(doc) : undefined;
};

export const getUserById = async (userId: string) => {
  const doc = await User.findById(userId);
  return doc ? toRecord(doc) : undefined;
};

export const createUser = async (payload: {
  name: string;
  email: string;
  passwordHash: string;
}) => {
  const doc = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password_hash: payload.passwordHash
  });
  return toRecord(doc);
};
