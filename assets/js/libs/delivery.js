const DELIVERY = [
  { "Code": 1, "Wilaya": "Alger", "A_domicile": 450, "Stop_desk": 300, "Retour": 0, "DeliveryTime": "12H" },
  { "Code": 2, "Wilaya": "Blida", "A_domicile": 600, "Stop_desk": 400, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 3, "Wilaya": "Boumerdes", "A_domicile": 600, "Stop_desk": 400, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 4, "Wilaya": "Tipaza", "A_domicile": 600, "Stop_desk": 400, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 5, "Wilaya": "Ain Defla", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 6, "Wilaya": "Ain Temouchent", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 7, "Wilaya": "Annaba", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 8, "Wilaya": "Batna", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 9, "Wilaya": "Bejaia", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 10, "Wilaya": "Bordj Bou Arraridj", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 11, "Wilaya": "Bouira", "A_domicile": 700, "Stop_desk": 400, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 12, "Wilaya": "Chlef", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 13, "Wilaya": "Constantine", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 14, "Wilaya": "El Taref", "A_domicile": 900, "Stop_desk": 500, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 15, "Wilaya": "Guelma", "A_domicile": 900, "Stop_desk": 450, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 16, "Wilaya": "Jijel", "A_domicile": 850, "Stop_desk": 450, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 17, "Wilaya": "Khenchela", "A_domicile": 900, "Stop_desk": 500, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 18, "Wilaya": "Mascara", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 19, "Wilaya": "Medea", "A_domicile": 700, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 20, "Wilaya": "Mila", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 21, "Wilaya": "Mostaganem", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 22, "Wilaya": "MSila", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 23, "Wilaya": "Oran", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 24, "Wilaya": "Oum el Bouaghi", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 25, "Wilaya": "Relizane", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 26, "Wilaya": "Saida", "A_domicile": 900, "Stop_desk": 450, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 27, "Wilaya": "Setif", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 28, "Wilaya": "Sidi bel Abbas", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 29, "Wilaya": "Skikda", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 30, "Wilaya": "Souk Ahras", "A_domicile": 900, "Stop_desk": 480, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 31, "Wilaya": "Tiaret", "A_domicile": 900, "Stop_desk": 450, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 32, "Wilaya": "Tissemsilt", "A_domicile": 800, "Stop_desk": 450, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 33, "Wilaya": "Tizi Ouzou", "A_domicile": 700, "Stop_desk": 400, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 34, "Wilaya": "Tlemcen", "A_domicile": 800, "Stop_desk": 430, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 35, "Wilaya": "Biskra", "A_domicile": 1000, "Stop_desk": 550, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 36, "Wilaya": "Djelfa", "A_domicile": 1000, "Stop_desk": 600, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 37, "Wilaya": "Ouled Djellal", "A_domicile": 1000, "Stop_desk": 700, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 38, "Wilaya": "El Oued", "A_domicile": 1100, "Stop_desk": 600, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 39, "Wilaya": "Touggourt", "A_domicile": 1100, "Stop_desk": 750, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 40, "Wilaya": "El Mghair", "A_domicile": 1100, "Stop_desk": 700, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 41, "Wilaya": "Ghardaia", "A_domicile": 1100, "Stop_desk": 650, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 42, "Wilaya": "El Meniaa", "A_domicile": 1150, "Stop_desk": 700, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 43, "Wilaya": "Laghouat", "A_domicile": 1000, "Stop_desk": 600, "Retour": 0, "DeliveryTime": "24H" },
  { "Code": 44, "Wilaya": "Ouargla", "A_domicile": 1100, "Stop_desk": 600, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 45, "Wilaya": "Tebessa", "A_domicile": 900, "Stop_desk": 500, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 46, "Wilaya": "Naama", "A_domicile": 1200, "Stop_desk": 700, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 47, "Wilaya": "Bechar", "A_domicile": 1200, "Stop_desk": 700, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 48, "Wilaya": "Beni Abbas", "A_domicile": 1300, "Stop_desk": 850, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 49, "Wilaya": "El Bayadh", "A_domicile": 1200, "Stop_desk": 700, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 50, "Wilaya": "Adrar", "A_domicile": 1500, "Stop_desk": 800, "Retour": 0, "DeliveryTime": "48H" },
  { "Code": 51, "Wilaya": "Timimoune", "A_domicile": 1500, "Stop_desk": 850, "Retour": 0, "DeliveryTime": "72H" },
  { "Code": 52, "Wilaya": "Tindouf", "A_domicile": 1500, "Stop_desk": 900, "Retour": 0, "DeliveryTime": "72H" },
  { "Code": 53, "Wilaya": "Illizi", "A_domicile": 2000, "Stop_desk": 1200, "Retour": 0, "DeliveryTime": "72H" },
  { "Code": 54, "Wilaya": "Tamanrasset", "A_domicile": 1800, "Stop_desk": 1200, "Retour": 0, "DeliveryTime": "72H" },
  { "Code": 55, "Wilaya": "In Salah", "A_domicile": 1800, "Stop_desk": 1200, "Retour": 0, "DeliveryTime": "72H" },
  { "Code": 56, "Wilaya": "Djanet", "A_domicile": 2900, "Stop_desk": 2200, "Retour": 0, "DeliveryTime": "72H" }

]

// ── Lookup fix ────────────────────────────────────────────────────────
// NOTE: `DELIVERY[i].Code` above is just this list's own row number
// (1-56) — it is NOT the wilaya's official code, and does not line up
// with WILAYAS[i].id/code (e.g. Alger is wilaya 16, but sits at Code 1
// here). Matching them directly (as the original template did) silently
// returns the wrong wilaya's price for almost every selection. This
// looks the row up by wilaya NAME instead, which is the only field the
// two lists actually share. A few rows use slightly different spelling
// between the two files, so those are aliased explicitly below. Wilayas
// with no row here (e.g. Bordj Baji Mokhtar, In Guezzam, and the 11
// wilayas created in 2025) genuinely have no published rate yet — the
// page correctly shows "غير متوفر لهذه الولاية" for those.
const DELIVERY_NAME_ALIASES = {
  "tbessa": "tebessa",
  "sidibelabbes": "sidibelabbas",
  "bordjbouarreridj": "bordjbouarraridj",
  "eltarf": "eltaref",
  "elmenia": "elmeniaa",
  "timimoun": "timimoune",
  "beniabbes": "beniabbas",
};

function normalizeWilayaName(s) {
  return (s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase().replace(/[^a-z]/g, "");             // keep letters only
}

function findDeliveryRowForWilaya(wilayaNameOrId) {
  if (typeof DELIVERY === "undefined") return null;

  // Accept either a WILAYAS entry's `name`, or an `id`/`code` looked up
  // against WILAYAS first.
  let name = wilayaNameOrId;
  if (typeof WILAYAS !== "undefined" && /^\d+$/.test(String(wilayaNameOrId))) {
    const w = WILAYAS.find(w => String(w.id) === String(wilayaNameOrId));
    if (w) name = w.name;
  }

  let key = normalizeWilayaName(name);
  key = DELIVERY_NAME_ALIASES[key] || key;

  return DELIVERY.find(d => normalizeWilayaName(d.Wilaya) === key) || null;
}