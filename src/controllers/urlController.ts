import { Request, Response } from "express";
import urlService from "../services/urlService";
import generateQRCode from "../qrCodeGenerator";
import UrlModel from "../models/Url";
import fs from "fs";

class UrlController {
  async shortenUrl(req: Request, res: Response): Promise<void> {
    try {
      const { originalUrl } = req.body;

      if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
        throw new Error("Invalid URL format");
      }

      const urlDoc = await UrlModel.findOne({ originalUrl });

      if (urlDoc) {
        res.status(200).json({
          message: "Short URL already exists",
          shortUrl: urlDoc.shortUrl,
        });
        return;
      }

      const shortUrl = await urlService.shortenUrl(originalUrl);

      // Update table with shortUrl
      await UrlModel.create({
        originalUrl,
        shortUrl,
      });

      res.status(200).json({
        message: "Short URL generated successfully",
        shortUrl, 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}


async deleteUrl(req: Request, res: Response): Promise<void> {
  try {
    const { shortUrl } = req.body;

    // Delete the URL document by its short URL
    const deletedUrl = await UrlModel.deleteOne({ shortUrl });

    if (deletedUrl.deletedCount === 0) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}




  async customizeUrl(req: Request, res: Response): Promise<void> {
    try {
      const { shortUrl, customUrl } = req.body;

      
      const existingUrl = await UrlModel.findOne({ shortUrl: customUrl });
      if (existingUrl) {
        res.status(400).json({ error: "Custom URL already in use" });
        return;
      }

      
      await UrlModel.findOneAndUpdate({ shortUrl }, { shortUrl: customUrl });

      res.status(200).json({ message: "Custom URL updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async generateQRCode(shortUrl: string): Promise<void> {
    try {
      
      const filePath = `./public/qr_codes/${shortUrl}.png`;

     
      await generateQRCode(filePath);
    } catch (error) {
      console.error(error);
    }
  }

    async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { shortUrl } = req.params;

      
      const url = await UrlModel.findOne({ shortUrl });

      if (!url) {
        res.status(404).json({ error: "Short URL not found" });
        return;
      }

     
      res.status(200).json({ clicks: url!.clicks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  async downloadQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { shortUrl } = req.params;

     
      const filePath = `../public/qr_codes/${shortUrl}.png`;

     
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "QR Code not found" });
        return;
      }

     
      res.sendFile(filePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new UrlController();