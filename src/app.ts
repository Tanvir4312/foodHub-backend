import express, { Application } from "express";

const app: Application = express();

app.get("/", async (req, res) => {
  res.send("Server Running");
});

export default app;
