const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const userRouter = express.Router();

userRouter.get('/', (req: any, res: { render: (arg0: string) => void; }) => {
  res.render('index');
});
userRouter.get('/login', (req: any, res: { render: (arg0: string) => void; }) => {
  res.render('login');
});

userRouter.get('/signup', (req: any, res: { render: (arg0: string) => void; }) => {
  res.render('signup');
});

userRouter.get('/shorten', (req: any, res: { render: (arg0: string) => void; }) => {
  res.render('shorten');
});
userRouter.get('/layout', (req: { query: { shortUrl: any; }; }, res: { render: (arg0: string, arg1: { shortUrl: any; }) => void; }) => {
  const { shortUrl } = req.query;
  res.render('layout', { shortUrl });
});
// Handle login request
userRouter.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().trim(),
  ],
  async (req: any, res: any) => {
    try {
      const response = await authController.login(req, res);
      if (response && response.code !== 200) {
        res.render("login", { message: response.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

userRouter.post("/signup", 
  [
    body('email').isEmail().normalizeEmail(),
    body('first_name').notEmpty().trim(),
    body('last_name').notEmpty().trim(),
    body('password').notEmpty(),
  ],
  async (req: { body: { email: any; first_name: any; last_name: any; password: any; }; }, res: { redirect: (arg0: string) => void; render: (arg0: string, arg1: { message: any; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
    try {
      const response = await authController.createUser({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
      });

      if (response.code === 200) {
        res.redirect('/login');
      } else {
        res.render('signup', { message: response.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

export default userRouter;
