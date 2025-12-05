const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export const endpoints = {
  health: () => `${API_BASE}/health`,
  seed: () => `${API_BASE}/dev/seed`,
  accounts: () => `${API_BASE}/accounts`,
  journal: () => `${API_BASE}/journal`,
  trialBalance: () => `${API_BASE}/reports/trial-balance`,
  ledger: (accountId: string) => `${API_BASE}/reports/ledger/${accountId}`,
};
