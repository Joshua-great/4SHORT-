"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.login = void 0;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const user_1 = __importDefault(require("../models/user"));
const logger_1 = __importDefault(require("../utils/logger"));
const createUser = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info("[CreateUser] => Signup process started");
        const existingUser = yield user_1.default.findOne({ email: userInfo.email });
        if (existingUser) {
            return {
                message: "User already exists",
                code: 409,
            };
        }
        const newUser = yield user_1.default.create({
            email: userInfo.email,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            password: userInfo.password,
        });
        logger_1.default.info("[CreateUser] => User with email " +
            newUser.email +
            " created successfully");
        return {
            message: "Successful signup",
            code: 200,
            newUser,
        };
    }
    catch (error) {
        logger_1.default.error("[CreateUser] => Error in signup process: " + error);
        return {
            message: "Internal Server Error",
            code: 500,
        };
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info("[Authenticate user] => login process started");
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            res.render("login", { message: "User not found" });
            return {
                code: 404,
                message: "User not found",
                redirectUrl: null, // No redirection, user not found
            };
        }
        const validPassword = yield user.isValidPassword(password);
        if (!validPassword) {
            res.render("login", { message: "Email or password is incorrect" });
            return {
                code: 422,
                message: "Email or password is incorrect",
                redirectUrl: null, // No redirection, invalid password
            };
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        logger_1.default.info("[Authenticate user] => Login process successful");
        res.cookie("jwt", token, {
            maxAge: 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
        });
        // Return the URL string to redirect to after successful login
        return {
            code: 200,
            message: "Login successful",
            redirectUrl: "/shorten",
        };
    }
    catch (error) {
        logger_1.default.error("[Authenticate user] => Error in login process: " + error);
        res.status(500).render("login", { message: "Internal Server Error" }); // Send status code 500
        return {
            code: 500,
            message: "Internal Server Error",
            redirectUrl: null, // No redirection due to error
        };
    }
});
exports.login = login;
