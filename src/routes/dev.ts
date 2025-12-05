import { Router } from "express";
import { accountingService } from "../accounting/AccountingService";

export const devRouter = Router();

// Basit kontrol: daha önce seed yapıldı mı?
function isAlreadySeeded() {
  const accounts = accountingService.listAccounts();
  return accounts.length > 0;
}

devRouter.post("/seed", (req, res) => {
  if (isAlreadySeeded()) {
    return res.json({ message: "Already seeded, skipping.", seeded: false });
  }

  // --- Hesaplar ---
  const kasa = accountingService.createAccount("100", "Kasa", "ASSET");
  const banka = accountingService.createAccount("102", "Banka", "ASSET");
  const hammadde = accountingService.createAccount(
    "150",
    "Hammadde Stok",
    "ASSET"
  );
  const mamul = accountingService.createAccount("153", "Mamul Stok", "ASSET");

  const uretimHatti = accountingService.createAccount(
    "255",
    "Endüstri 4.0 Üretim Hattı",
    "ASSET"
  );

  const satıcılar = accountingService.createAccount(
    "320",
    "Satıcılar",
    "LIABILITY"
  );

  const ozkaynak = accountingService.createAccount(
    "500",
    "Özkaynaklar",
    "EQUITY"
  );

  const iotGider = accountingService.createAccount(
    "770",
    "IoT Sensör Giderleri",
    "EXPENSE"
  );

  const satisGelir = accountingService.createAccount(
    "600",
    "Akıllı Fabrika Çözümleri Satış Geliri",
    "INCOME"
  );

  const bakımGelir = accountingService.createAccount(
    "602",
    "Predictive Maintenance Gelirleri",
    "INCOME"
  );

  // --- Fişler ---

  // 1) Kurucu ortak kasaya 500.000 TL sermaye koydu
  accountingService.postEntry({
    date: "2025-12-01",
    description: "Sermaye girişi",
    lines: [
      { accountId: kasa.id, debit: 500_000 },
      { accountId: ozkaynak.id, credit: 500_000 },
    ],
  });

  // 2) 80.000 TL hammadde stok alımı (vadeli, satıcılar)
  accountingService.postEntry({
    date: "2025-12-02",
    description: "Hammadde stok alımı (Endüstri 4.0 üretim hattı için)",
    lines: [
      { accountId: hammadde.id, debit: 80_000 },
      { accountId: satıcılar.id, credit: 80_000 },
    ],
  });

  // 3) Satıcıya 20.000 TL banka üzerinden ödeme
  accountingService.postEntry({
    date: "2025-12-03",
    description: "Satıcı ödemesi",
    lines: [
      { accountId: satıcılar.id, debit: 20_000 },
      { accountId: banka.id, credit: 20_000 },
    ],
  });

  // 4) IoT sensörleri kurulumu için 10.000 TL gider (bankadan)
  accountingService.postEntry({
    date: "2025-12-03",
    description: "IoT sensör kurulumu ve entegrasyon gideri",
    lines: [
      { accountId: iotGider.id, debit: 10_000 },
      { accountId: banka.id, credit: 10_000 },
    ],
  });

  // 5) Endüstri 4.0 üretim hattı yatırımı (kasadan 200.000 TL)
  accountingService.postEntry({
    date: "2025-12-04",
    description: "Endüstri 4.0 üretim hattı kurulumu",
    lines: [
      { accountId: uretimHatti.id, debit: 200_000 },
      { accountId: kasa.id, credit: 200_000 },
    ],
  });

  // 6) Akıllı fabrika çözümü satışı 150.000 TL (müşteri banka havalesi ile ödedi)
  accountingService.postEntry({
    date: "2025-12-04",
    description: "Akıllı fabrika yazılım & entegrasyon satışı",
    lines: [
      { accountId: banka.id, debit: 150_000 },
      { accountId: satisGelir.id, credit: 150_000 },
    ],
  });

  // 7) Predictive maintenance yıllık sözleşme satışı 30.000 TL (nakit)
  accountingService.postEntry({
    date: "2025-12-05",
    description: "Predictive maintenance hizmet satışı",
    lines: [
      { accountId: banka.id, debit: 30_000 },
      { accountId: bakımGelir.id, credit: 30_000 },
    ],
  });

  return res.json({ message: "Seed completed", seeded: true });
});
