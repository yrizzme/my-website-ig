import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import ViteExpress from "vite-express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const startServer = async () => {
  await registerRoutes(app);
  
  ViteExpress.listen(app, 5000, () => {
    console.log("Server is listening on port 5000...");
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
