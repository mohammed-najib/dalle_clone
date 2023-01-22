import express from "express";
import * as dotenv from "dotenv";
// import { Configuration, OpenAIApi } from "openai";
import { getImageFromPrompt } from "../ai";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Hello from DALL-E!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const aiResponse = await getImageFromPrompt(prompt, 1, 512, 512);

    const image = aiResponse.base64Image;

    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

export default router;
