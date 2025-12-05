export type AccountType =
  | "ASSET"
  | "LIABILITY"
  | "EQUITY"
  | "INCOME"
  | "EXPENSE";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
}

export interface JournalLine {
  id: string;
  entryId: string;
  accountId: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO
  description: string;
  lines: JournalLine[];
}
