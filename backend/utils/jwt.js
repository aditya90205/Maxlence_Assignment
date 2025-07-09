import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../model/User.js";

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
