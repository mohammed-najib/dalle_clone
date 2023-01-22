import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect";
import postRotes from "./routes/post.routes";
import dalleRotes from "./routes/dalle.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRotes);
app.use("/api/v1/dalle", dalleRotes);

app.get("/", async (req, res) => {
  res.send("Hello from DALL-E!");
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL as string);

    app.listen(8080, () =>
      console.log("Server has starte on port http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
