import express from "express";
import cors from "cors";
import path from "path";
import { accountsRouter } from "./routes/accounts";
import { journalRouter } from "./routes/journal";
import { reportsRouter } from "./routes/reports";
import { devRouter } from "./routes/dev";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// static frontend (public klasöründen)
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/accounts", accountsRouter);
app.use("/journal", journalRouter);
app.use("/reports", reportsRouter);

// Dev only
app.use("/dev", devRouter);

app.listen(PORT, () => {
  console.log(`Mini accounting service running on http://localhost:${PORT}`);
});
