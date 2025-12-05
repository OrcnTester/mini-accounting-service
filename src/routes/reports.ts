import { Router } from "express";
import { accountingService } from "../accounting/AccountingService";

export const reportsRouter = Router();

// GET /reports/trial-balance
reportsRouter.get("/trial-balance", (req, res) => {
  const tb = accountingService.getTrialBalance();
  res.json(tb);
});

// GET /reports/ledger/:accountId
reportsRouter.get("/ledger/:accountId", (req, res) => {
  try {
    const { accountId } = req.params;
    const ledger = accountingService.getAccountLedger(accountId);
    res.json(ledger);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Unknown error" });
  }
});
