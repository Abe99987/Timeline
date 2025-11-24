import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 4000;

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "timeline-backend" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`timeline-backend listening on port ${port}`);
});



