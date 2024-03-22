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
        shortUrl, // Return the generated short URL
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
}


  


  async customizeUrl(req: Request, res: Response): Promise<void> {
    try {
      const { shortUrl, customUrl } = req.body;

      // Check if the custom URL is already in use
      const existingUrl = await UrlModel.findOne({ shortUrl: customUrl });
      if (existingUrl) {
        res.status(400).json({ error: "Custom URL already in use" });
        return;
      }

      // Update the short URL with the custom URL
      await UrlModel.findOneAndUpdate({ shortUrl }, { shortUrl: customUrl });

      res.status(200).json({ message: "Custom URL updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async generateQRCode(shortUrl: string): Promise<void> {
    try {
      // Define the file path where the QR code will be saved
      const filePath = `./public/qr_codes/${shortUrl}.png`;

      // Generate QR code and save it to the file path
      await generateQRCode(filePath);
    } catch (error) {
      console.error(error);
    }
  }

    async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { shortUrl } = req.params;

      // Fetch analytics data for the given short URL
      const url = await UrlModel.findOne({ shortUrl });

      if (!url) {
        res.status(404).json({ error: "Short URL not found" });
        return;
      }

      // Return the analytics data
      res.status(200).json({ clicks: url!.clicks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  async downloadQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { shortUrl } = req.params;

      // Define the file path of the QR code
      const filePath = `./public/qr_codes/${shortUrl}.png`;

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "QR Code not found" });
        return;
      }

      // Send the file as a response
      res.sendFile(filePath);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new UrlController();