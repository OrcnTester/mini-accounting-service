import { Router } from "express";
import { accountingService } from "../accounting/AccountingService";
import { AccountType } from "../accounting/types";

export const accountsRouter = Router();

// GET /accounts
accountsRouter.get("/", (req, res) => {
  const accounts = accountingService.listAccounts();
  res.json(accounts);
});

// POST /accounts
accountsRouter.post("/", (req, res) => {
  try {
    const { code, name, type } = req.body;

    if (!code || !name || !type) {
      return res.status(400).json({ error: "code, name, type required" });
    }

    const validTypes: AccountType[] = [
      "ASSET",
      "LIABILITY",
      "EQUITY",
      "INCOME",
      "EXPENSE",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid account type" });
    }

    const acc = accountingService.createAccount(code, name, type);
    res.status(201).json(acc);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Unknown error" });
  }
});
