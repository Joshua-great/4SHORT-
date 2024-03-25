"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urlController_1 = __importDefault(require("../controllers/urlController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get('/shorten', auth_1.default, (req, res) => {
    res.render('shorten');
});
router.post('/shorten-url', urlController_1.default.shortenUrl);
router.post('/delete-url', urlController_1.default.deleteUrl);
router.post('/customize', urlController_1.default.customizeUrl);
router.get('/generate-qr/:urlId', urlController_1.default.generateQRCode);
router.get('/analytics', urlController_1.default.getAnalytics);
exports.default = router;
