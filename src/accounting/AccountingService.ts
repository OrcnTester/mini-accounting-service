import { Account, AccountType, JournalEntry, JournalLine } from "./types";
import { nextId } from "./utils";

export class AccountingService {
  private accounts: Account[] = [];
  private entries: JournalEntry[] = [];

  createAccount(code: string, name: string, type: AccountType): Account {
    const existing = this.accounts.find(a => a.code === code);
    if (existing) {
      throw new Error(`Account code already exists: ${code}`);
    }

    const account: Account = {
      id: nextId("acc"),
      code,
      name,
      type,
    };

    this.accounts.push(account);
    return account;
  }

  listAccounts(): Account[] {
    return [...this.accounts].sort((a, b) => a.code.localeCompare(b.code));
  }

  postEntry(params: {
    date: string;
    description: string;
    lines: { accountId: string; debit?: number; credit?: number }[];
  }): JournalEntry {
    if (!params.lines || params.lines.length === 0) {
      throw new Error("At least one line is required.");
    }

    const lines: JournalLine[] = params.lines.map(l => {
      const account = this.accounts.find(a => a.id === l.accountId);
      if (!account) {
        throw new Error(`Invalid accountId: ${l.accountId}`);
      }

      const debit = l.debit ?? 0;
      const credit = l.credit ?? 0;

      if (debit < 0 || credit < 0) {
        throw new Error("Debit/credit cannot be negative.");
      }
      if (debit > 0 && credit > 0) {
        throw new Error("A line cannot have both debit and credit.");
      }
      if (debit === 0 && credit === 0) {
        throw new Error("A line must have debit or credit.");
      }

      return {
        id: nextId("line"),
        entryId: "",
        accountId: l.accountId,
        debit,
        credit,
      };
    });

    const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lines.reduce((s, l) => s + l.credit, 0);

    if (Number(totalDebit.toFixed(2)) !== Number(totalCredit.toFixed(2))) {
      throw new Error(
        `Entry is not balanced. debit=${totalDebit} credit=${totalCredit}`
      );
    }

    const entryId = nextId("je");
    const entry: JournalEntry = {
      id: entryId,
      date: params.date,
      description: params.description,
      lines: lines.map(l => ({ ...l, entryId })),
    };

    this.entries.push(entry);
    return entry;
  }

  listEntries(): JournalEntry[] {
    return [...this.entries].sort((a, b) => a.date.localeCompare(b.date));
  }

  getTrialBalance() {
    return this.accounts
      .map(acc => {
        const lines = this.entries.flatMap(e =>
          e.lines.filter(l => l.accountId === acc.id)
        );

        const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
        const totalCredit = lines.reduce((s, l) => s + l.credit, 0);

        let balance: number;
        if (acc.type === "ASSET" || acc.type === "EXPENSE") {
          balance = totalDebit - totalCredit;
        } else {
          balance = totalCredit - totalDebit;
        }

        return {
          accountId: acc.id,
          code: acc.code,
          name: acc.name,
          type: acc.type,
          totalDebit,
          totalCredit,
          balance,
        };
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  getAccountLedger(accountId: string) {
    const account = this.accounts.find(a => a.id === accountId);
    if (!account) throw new Error("Account not found");

    const lines = this.entries
      .flatMap(e =>
        e.lines.map(l => ({
          entryId: e.id,
          date: e.date,
          description: e.description,
          accountId: l.accountId,
          debit: l.debit,
          credit: l.credit,
        }))
      )
      .filter(l => l.accountId === accountId)
      .sort((a, b) => a.date.localeCompare(b.date));

    let runningBalance = 0;

    const detailed = lines.map(l => {
      if (account.type === "ASSET" || account.type === "EXPENSE") {
        runningBalance += l.debit - l.credit;
      } else {
        runningBalance += l.credit - l.debit;
      }

      return {
        date: l.date,
        description: l.description,
        debit: l.debit,
        credit: l.credit,
        balance: runningBalance,
      };
    });

    return {
      account,
      lines: detailed,
      finalBalance: runningBalance,
    };
  }
}

export const accountingService = new AccountingService();
