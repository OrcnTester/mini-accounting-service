import { Router } from "express";
import { accountingService } from "../accounting/AccountingService";

export const journalRouter = Router();

// GET /journal
journalRouter.get("/", (req, res) => {
  const entries = accountingService.listEntries();
  res.json(entries);
});

// POST /journal
journalRouter.post("/", (req, res) => {
  try {
    const { date, description, lines } = req.body;

    if (!date || !description || !Array.isArray(lines)) {
      return res
        .status(400)
        .json({ error: "date, description, lines are required" });
    }

    const entry = accountingService.postEntry({
      date,
      description,
      lines,
    });

    res.status(201).json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Unknown error" });
  }
});
