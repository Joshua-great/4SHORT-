const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
import { Request, Response } from 'express'; 
import User from '../models/user'; 
import logger from '../utils/logger';

const createUser = async (userInfo: { email: any; first_name: any; last_name: any; password: any; }) => {
  try {
    logger.info("[CreateUser] => Signup process started");
    const existingUser = await User.findOne({ email: userInfo.email });
    if (existingUser) {
      return {
        message: "User already exists",
        code: 409,
      };
    }
    const newUser = await User.create({
      email: userInfo.email,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      password: userInfo.password,
    });
    logger.info(
      "[CreateUser] => User with email " +
        newUser.email +
        " created successfully"
    );
    return {
      message: "Successful signup",
      code: 200,
      newUser,
    };
  } catch (error) {
    logger.error("[CreateUser] => Error in signup process: " + error);
    return {
      message: "Internal Server Error",
      code: 500,
    };
  }
};

const login = async (req: Request, res: Response) => {
  try {
    logger.info("[Authenticate user] => login process started");
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        code: 404,
        message: "User not found",
        redirectUrl: null, // No redirection, user not found
      };
    }
    const validPassword = await user.isValidPassword(password);
    if (!validPassword) {
      return {
        code: 422,
        message: "Email or password is incorrect",
        redirectUrl: null, 
      };
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    logger.info("[Authenticate user] => Login process successful");
    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
    });
    
    return {
      code: 200,
      message: "Login successful",
      redirectUrl: "/shorten",
    };
  } catch (error) {
    logger.error("[Authenticate user] => Error in login process: " + error);
    return {
      code: 500,
      message: "Internal Server Error",
      redirectUrl: null, 
    };
  }
};


export { login, createUser };