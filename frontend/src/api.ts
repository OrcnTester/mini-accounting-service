// frontend/src/api.ts

// Ortam değişkenini al
let rawBase = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

// Boşlukları kes
rawBase = rawBase.trim();

// Eğer "http" ile başlamıyorsa, host/path gibi düşün ve https:// ekle
if (rawBase && !/^https?:\/\//i.test(rawBase)) {
  // Baştaki / işaretlerini temizle
  rawBase = rawBase.replace(/^\/+/, "");
  rawBase = `https://${rawBase}`;
}

// Sondaki / işaretini temizle (base URL tertemiz olsun)
if (rawBase.endsWith("/")) {
  rawBase = rawBase.slice(0, -1);
}

export const API_BASE = rawBase;

export const endpoints = {
  health: () => `${API_BASE}/health`,
  seed: () => `${API_BASE}/dev/seed`,
  accounts: () => `${API_BASE}/accounts`,
  journal: () => `${API_BASE}/journal`,
  trialBalance: () => `${API_BASE}/reports/trial-balance`,
  ledger: (accountId: string) => `${API_BASE}/reports/ledger/${accountId}`,
};
