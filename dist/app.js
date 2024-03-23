"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const urlRoutes_1 = __importDefault(require("./routes/urlRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./utils/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // default to 15 minutes (900,000 milliseconds)
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10), // default to 100 requests
});
(0, database_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const viewsPath = path_1.default.join(__dirname, "../src/views");
app.set("view engine", "hbs");
app.set("views", viewsPath);
const publicPath = path_1.default.join(__dirname, "../src/public");
app.use(express_1.default.static(publicPath));
console.log(`Public path: ${publicPath}`);
app.use("/", authRoutes_1.default);
app.use("/", urlRoutes_1.default);
app.use(express_1.default.Router());
app.use(express_1.default.json());
app.use(limiter);
app.use((req, res) => {
    res.status(404).render("404");
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
