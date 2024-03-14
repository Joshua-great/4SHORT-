import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import hbs from "hbs";
import rateLimit from "express-rate-limit";
import urlRoutes from "./routes/urlRoutes";
import passport from "passport";
import authRoutes from "./routes/authRoutes";

import path from "path";
import connectDB from "./utils/database";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // default to 15 minutes (900,000 milliseconds)
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10), // default to 100 requests
});

connectDB();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars middleware
const viewsPath = path.join(__dirname, "../src/views");
app.set("view engine", "hbs");
app.set("views", viewsPath);
const publicPath = path.join(__dirname,"../src/public");
app.use(express.static(publicPath));
console.log(`Public path: ${publicPath}`);
// const imagesPath = path.join(__dirname, "../src/images");
// app.use("/images", express.static(imagesPath));

// const stylesPath = path.join(__dirname, "../src/styles");
// app.use("/styles", express.static(stylesPath));

// // // Check that imagesPath and stylesPath can be reached
// console.log(`Images path: ${imagesPath}`);
// console.log(`Styles path: ${stylesPath}`);

// Routes
app.use("/", authRoutes); // Use authRoutes for login and signup
app.use("/", urlRoutes); // Use urlRoutes for URL-related paths

// app.use('/auth', indexRouter);

app.use(express.Router());
app.use(express.json());
app.use(limiter);
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
