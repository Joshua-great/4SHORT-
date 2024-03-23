import express from 'express';
import urlController from '../controllers/urlController';
import isAuthenticated from '../middleware/auth';

const router = express.Router();

// router.get('/layout', (req, res) => {
//   res.render('layout');
// });

// router.get('/layout', (req, res) => {
//   const { shortUrl } = req.query;
//   res.render('layout', { shortUrl });
// });
router.get('/shorten', isAuthenticated, (req, res) => {
  res.render('shorten');
});
router.post('/shorten-url', urlController.shortenUrl);
router.post('/delete-url', urlController.deleteUrl);

router.post('/customize', urlController.customizeUrl);


router.get('/generate-qr/:urlId', urlController.generateQRCode);


router.get('/analytics', urlController.getAnalytics);

export default router;
