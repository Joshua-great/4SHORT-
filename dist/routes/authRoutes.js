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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const userRouter = express.Router();
userRouter.get('/', (req, res) => {
    res.render('index');
});
userRouter.get('/login', (req, res) => {
    res.render('login');
});
userRouter.get('/signup', (req, res) => {
    res.render('signup');
});
userRouter.get('/shorten', (req, res) => {
    res.render('shorten');
});
userRouter.get('/layout', (req, res) => {
    const { shortUrl } = req.query;
    res.render('layout', { shortUrl });
});
// Handle login request
userRouter.post("/login", [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().trim(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authController.login(req, res);
        if (response && response.code !== 200) {
            res.render("login", { message: response.message });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
userRouter.post("/signup", [
    body('email').isEmail().normalizeEmail(),
    body('first_name').notEmpty().trim(),
    body('last_name').notEmpty().trim(),
    body('password').notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield authController.createUser({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        });
        if (response.code === 200) {
            res.redirect('/login');
        }
        else {
            res.render('signup', { message: response.message });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.default = userRouter;
