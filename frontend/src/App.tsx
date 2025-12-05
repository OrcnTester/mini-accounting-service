import { useEffect, useState } from "react";
import { endpoints } from "./api";

type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";

interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
}

interface JournalLine {
  id: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalLine[];
}

interface TrialBalanceRow {
  accountId: string;
  code: string;
  name: string;
  type: AccountType;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

interface LedgerLine {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

interface LedgerResponse {
  account: Account;
  lines: LedgerLine[];
  finalBalance: number;
}

function formatNumber(n: number) {
  return n.toLocaleString("tr-TR");
}

function App() {
  const [seedStatus, setSeedStatus] = useState<string>(
    "Henüz seed çağrılmadı. (Sadece ilk kurulumda 1 kere bas.)"
  );
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalanceRow[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [selectedAccountName, setSelectedAccountName] = useState<string>("");
  const [ledger, setLedger] = useState<LedgerLine[]>([]);

  const [loadingSeed, setLoadingSeed] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingTB, setLoadingTB] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(false);
  const [loadingLedger, setLoadingLedger] = useState(false);

  async function handleSeed() {
    try {
      setLoadingSeed(true);
      setSeedStatus("Seed çağrılıyor...");
      const res = await fetch(endpoints.seed(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.seeded) {
        setSeedStatus(
          "Demo veriler başarıyla yüklendi. Hesaplar ve mizan güncellendi."
        );
      } else {
        setSeedStatus(
          "Zaten daha önce seed edilmiş. Mevcut datayı kullanıyorsun."
        );
      }
      await Promise.all([
        loadAccounts(),
        loadTrialBalance(),
        loadJournal(),
      ]);
    } catch (err) {
      console.error(err);
      setSeedStatus(
        "Seed sırasında hata oluştu. Backend loglarını kontrol et."
      );
    } finally {
      setLoadingSeed(false);
    }
  }

  async function loadAccounts() {
    try {
      setLoadingAccounts(true);
      const res = await fetch(endpoints.accounts());
      const data: Account[] = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAccounts(false);
    }
  }

  async function loadTrialBalance() {
    try {
      setLoadingTB(true);
      const res = await fetch(endpoints.trialBalance());
      const data: TrialBalanceRow[] = await res.json();
      setTrialBalance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTB(false);
    }
  }

  async function loadJournal() {
    try {
      setLoadingJournal(true);
      const res = await fetch(endpoints.journal());
      const data: JournalEntry[] = await res.json();
      setJournal(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJournal(false);
    }
  }

  async function loadLedger(accountId: string, accountName: string) {
    try {
      setLoadingLedger(true);
      setSelectedAccountId(accountId);
      setSelectedAccountName(accountName);

      const res = await fetch(endpoints.ledger(accountId));
      const data: LedgerResponse = await res.json();
      setLedger(data.lines ?? []);
    } catch (err) {
      console.error(err);
      setLedger([]);
    } finally {
      setLoadingLedger(false);
    }
  }

  // Sayfa açılışında dataları yükle
  useEffect(() => {
    loadAccounts();
    loadTrialBalance();
    loadJournal();
  }, []);

  return (
    <div className="app-shell">
      <header>
        <div className="title">
          <h1>Endüstri 4.0 Mini Accounting Console</h1>
          <span>
            IoT sensörleri, akıllı fabrika hatları ve predictive maintenance
            gelirlerini tek bakışta izle.
          </span>
        </div>
        <div>
          <div className="tag-badge">
            <div className="tag-dot" />
            <span>OPC-UA Ready • MES / ERP Friendly</span>
          </div>
        </div>
      </header>

      <div className="layout">
        {/* SOL: Seed + Hesaplar + Ekstre */}
        <div className="grid-rows">
          {/* Seed Card */}
          <section className="card">
            <div className="card-header">
              <h2>Demo Data</h2>
              <button
                id="btn-seed"
                className="btn"
                onClick={handleSeed}
                disabled={loadingSeed}
              >
                {loadingSeed ? "Yükleniyor..." : "⚙️ Endüstri 4.0 Demo Yükle"}
              </button>
            </div>
            <div className="status" id="seed-status">
              {seedStatus}
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span className="pill">
                <span className="pill-dot"></span>
                Akıllı fabrika satış geliri
              </span>
              <span className="pill">
                <span className="pill-dot"></span>
                IoT sensör giderleri
              </span>
              <span className="pill">
                <span className="pill-dot"></span>
                Predictive maintenance sözleşmesi
              </span>
            </div>
          </section>

          {/* Hesap Planı */}
          <section className="card">
            <div className="card-header">
              <h2>Hesap Planı</h2>
              <button
                className="btn-secondary"
                onClick={loadAccounts}
                disabled={loadingAccounts}
              >
                {loadingAccounts ? "Yükleniyor..." : "Yenile"}
              </button>
            </div>
            <div style={{ maxHeight: 280, overflow: "auto" }}>
              <table id="accounts-table">
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Ad</th>
                    <th>Tip</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className={
                        "account-row" +
                        (selectedAccountId === acc.id ? " selected" : "")
                      }
                      onClick={() => loadLedger(acc.id, acc.name)}
                    >
                      <td>{acc.code}</td>
                      <td>{acc.name}</td>
                      <td>
                        <span className="tag">{acc.type}</span>
                      </td>
                    </tr>
                  ))}
                  {accounts.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ fontSize: "0.8rem" }}>
                        Hesap bulunamadı. Önce demo datayı seed edebilirsin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Hesap Ekstresi */}
          <section className="card">
            <div className="card-header">
              <h2>Hesap Ekstresi</h2>
              <span
                id="ledger-title"
                style={{ fontSize: "0.8rem", color: "var(--muted)" }}
              >
                {selectedAccountId
                  ? `Seçili hesap: ${selectedAccountName}`
                  : "Bir hesaba tıklayarak ekstresini görüntüle."}
              </span>
            </div>
            <div style={{ maxHeight: 220, overflow: "auto" }}>
              <table id="ledger-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Açıklama</th>
                    <th>Borç</th>
                    <th>Alacak</th>
                    <th>Bakiye</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingLedger && (
                    <tr>
                      <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                        Ekstre yükleniyor...
                      </td>
                    </tr>
                  )}
                  {!loadingLedger && ledger.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                        {selectedAccountId
                          ? "Bu hesapta henüz hareket yok."
                          : "Hesap seçilmedi."}
                      </td>
                    </tr>
                  )}
                  {!loadingLedger &&
                    ledger.map((line, i) => (
                      <tr key={i}>
                        <td>{line.date}</td>
                        <td>{line.description}</td>
                        <td style={{ textAlign: "right" }}>
                          {formatNumber(line.debit)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatNumber(line.credit)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {formatNumber(line.balance)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* SAĞ: Mizan + Journal */}
        <div className="grid-rows">
          {/* Mizan */}
          <section className="card">
            <div className="card-header">
              <h2>Mizan (Trial Balance)</h2>
              <button
                className="btn-secondary"
                onClick={loadTrialBalance}
                disabled={loadingTB}
              >
                {loadingTB ? "Yükleniyor..." : "Mizanı Yükle"}
              </button>
            </div>
            <div style={{ maxHeight: 200, overflow: "auto" }}>
              <table id="tb-table">
                <thead>
                  <tr>
                    <th>Kod</th>
                    <th>Hesap</th>
                    <th>Toplam Borç</th>
                    <th>Toplam Alacak</th>
                    <th>Bakiye</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalance.map((row) => (
                    <tr key={row.accountId}>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td style={{ textAlign: "right" }}>
                        {formatNumber(row.totalDebit)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatNumber(row.totalCredit)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatNumber(row.balance)}
                      </td>
                    </tr>
                  ))}
                  {trialBalance.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                        Henüz mizan yok. Demo veriyi seed etmeyi deneyebilirsin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Journal */}
          <section className="card">
            <div className="card-header">
              <h2>Journal (Yevmiye)</h2>
              <button
                className="btn-secondary"
                onClick={loadJournal}
                disabled={loadingJournal}
              >
                {loadingJournal ? "Yükleniyor..." : "Kayıtları Yükle"}
              </button>
            </div>
            <div style={{ maxHeight: 200, overflow: "auto" }}>
              <table id="journal-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Açıklama</th>
                    <th>Satır Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {journal.map((e) => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td>{e.description}</td>
                      <td>{e.lines?.length ?? 0}</td>
                    </tr>
                  ))}
                  {journal.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ fontSize: "0.8rem" }}>
                        Henüz yevmiye kaydı yok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
