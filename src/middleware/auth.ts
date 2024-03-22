import { RequestHandler } from 'express';
import User from '../models/user';
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json("Unauthorized!. Please login");
    }

    if (token) {
      const decodedToken = jwt.verify(
        token as string,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      const userId = decodedToken.sub;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json("authorization not found");
      }
      req.user = user;
    }

     next();
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

export default isAuthenticated;
