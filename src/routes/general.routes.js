// FILE: src/routes/general.routes.js (General API - AI & Downloader)

import express from 'express';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { GoogleGenAI } from '@google/genai';
import axios from "axios";
import FormData from "form-data";

const router = express.Router();

// ===================================
// AI ENDPOINT
// ===================================
router.get('/ai/gemini', async (req, res) => {
  const text = req.query.text;
  const apikey = req.query.apikey;
  
  if (!text || !apikey) return res.status(400).json({ error: "Missing 'text' or 'apikey' parameter" });
  
  try {
    const ai = new GoogleGenAI({ apiKey: `${apikey}` });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${text}`
    });
    const replyText = response?.text ?? JSON.stringify(response);
    return res.json({ text: replyText });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ===================================
// DOWNLOADER ENDPOINT
// ===================================
router.get('/downloader/videy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

  try {
    const urlParts = url.split("/");
    const videoId = urlParts[urlParts.length - 1]; 
    
    if (!videoId) return res.status(400).json({ error: "Invalid 'url' parameter" });
    
    const anunyah = `https://cdn.videy.co/${videoId}.mp4`;
    return res.json({ fileurl: anunyah });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get('/downloader/pixeldrain', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing 'url' parameter" });

  try {
    const iyah = url.replace("/u/", "/api/file/");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('HTTP error when fetching pixeldrain page');
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const titleElement = doc.querySelector('title');
    let titleText = titleElement ? titleElement.textContent : '';
    const searchTerm = ' ~ pixeldrain';
    if (titleText.includes(searchTerm)) {
      titleText = titleText.split(searchTerm)[0].trim();
      return res.json({
        filename: titleText,
        fileurl: iyah
      });
    } else {
      return res.status(404).json({ error: "Pixeldrain file not found or invalid title" });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Catatan: Endpoint /tools/imagetools diabaikan karena mengembalikan file biner (bukan JSON) dan tidak cocok untuk diuji di antarmuka tester.html.

export default router;
