const pptx = require("pptxgenjs");
const p = new pptx();
p.layout = "LAYOUT_WIDE";           // 13.33 x 7.5
const W = 13.33, H = 7.5;

const INK = "12233B", NAVY = "0E1B2E", WHITE = "FFFFFF", MUT = "64748B",
      ICE = "9FB3C8", BLUE = "2563EB", RED = "DC2626", GREEN = "16A34A",
      CARD = "F1F5F9", LINE = "E2E8F0";
const TITLE_F = "Cambria", BODY_F = "Calibri";

const notes = {};

// ---------- helpers ----------
function title(s, txt, color = INK) {
  s.addText(txt, { x: 0.6, y: 0.45, w: 12.1, h: 0.9, fontFace: TITLE_F,
    fontSize: 32, bold: true, color, align: "left", margin: 0 });
}
function statCard(s, x, y, w, h, big, bigColor, label) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, fill: { color: CARD },
    rectRadius: 0.12, line: { color: LINE, width: 1 } });
  s.addText(big, { x: x + 0.15, y: y + 0.28, w: w - 0.3, h: h * 0.5,
    fontFace: TITLE_F, fontSize: 44, bold: true, color: bigColor, align: "center", margin: 0 });
  s.addText(label, { x: x + 0.2, y: y + h * 0.66, w: w - 0.4, h: h * 0.3,
    fontFace: BODY_F, fontSize: 13, color: MUT, align: "center", margin: 0 });
}
function bullets(s, x, y, w, items) {
  const rows = items.map((it, i) => ({
    text: it.h + "  ", options: { bold: true, color: INK, fontSize: 16,
      bullet: false, breakLine: false } }));
  // build paragraph list manually for header+desc
  let yy = y;
  items.forEach((it) => {
    s.addShape(p.ShapeType.ellipse, { x, y: yy + 0.06, w: 0.16, h: 0.16, fill: { color: it.c || BLUE } });
    s.addText([
      { text: it.h + "  ", options: { bold: true, color: INK } },
      { text: it.d, options: { color: MUT } },
    ], { x: x + 0.32, y: yy - 0.08, w: w - 0.32, h: 0.7, fontFace: BODY_F,
      fontSize: 15, align: "left", margin: 0, valign: "top" });
    yy += 0.82;
  });
}

// ================= Slide 1 — Title (dark) =================
let s = p.addSlide();
s.background = { color: NAVY };
s.addText("TELECOM · CUSTOMER ANALYTICS", { x: 0.7, y: 0.9, w: 8, h: 0.4,
  fontFace: BODY_F, fontSize: 13, color: ICE, charSpacing: 3, margin: 0 });
s.addText("Reducing Customer Churn", { x: 0.7, y: 2.15, w: 8.6, h: 1.1,
  fontFace: TITLE_F, fontSize: 46, bold: true, color: WHITE, margin: 0 });
s.addText("A retention business case", { x: 0.7, y: 3.25, w: 8.6, h: 0.7,
  fontFace: BODY_F, fontSize: 22, color: ICE, margin: 0 });
s.addText([
  { text: "26.5% churn = ", options: { color: ICE } },
  { text: "$1.67M/year at risk", options: { color: WHITE, bold: true } },
  { text: ". Here's how to win a third of it back.", options: { color: ICE } },
], { x: 0.7, y: 4.4, w: 8.6, h: 0.8, fontFace: BODY_F, fontSize: 17, margin: 0 });
s.addText("$1.67M", { x: 9.2, y: 2.7, w: 3.5, h: 1.4, fontFace: TITLE_F,
  fontSize: 62, bold: true, color: RED, align: "center", margin: 0 });
s.addText("annual revenue at risk", { x: 9.2, y: 4.05, w: 3.5, h: 0.5,
  fontFace: BODY_F, fontSize: 13, color: ICE, align: "center", margin: 0 });
notes[1] = "The carrier loses ~26.5% of customers a year, about $1.67M in annual recurring revenue. This readout shows who leaves, why, and the ROI of doing something about it.";

// ================= Slide 2 — The problem =================
s = p.addSlide();
title(s, "The problem: expensive, and concentrated");
statCard(s, 0.7, 2.2, 3.8, 2.4, "26.5%", RED, "of customers churn each year");
statCard(s, 4.77, 2.2, 3.8, 2.4, "$1.67M", RED, "annual recurring revenue at risk");
statCard(s, 8.84, 2.2, 3.8, 2.4, "$74 vs $61", BLUE, "churned pay more than retained (monthly)");
s.addText("Churn isn't a rate — it's revenue, and the customers leaving are the higher-value ones. That makes keeping them worth paying for.",
  { x: 0.7, y: 5.1, w: 11.9, h: 0.9, fontFace: BODY_F, fontSize: 17, color: INK, margin: 0 });
notes[2] = "Churners pay $74/mo vs $61 for those who stay — so this is expensive churn, which is exactly what makes a paid retention play pencil out.";

// ================= Slide 3 — Drivers =================
s = p.addSlide();
title(s, "Who churns — and it's predictable");
s.addImage({ path: "figures/churn_by_contract.png", x: 0.6, y: 1.7, w: 6.6, h: 3.77 });
bullets(s, 7.6, 2.1, 5.2, [
  { h: "Contract is the #1 lever.", d: "month-to-month 43% vs two-year 3%", c: RED },
  { h: "Electronic check: 45% churn", d: "the highest-risk payment method", c: BLUE },
  { h: "No tech support: 42%", d: "vs 15% with it", c: BLUE },
  { h: "Fiber optic: 42%", d: "elevated even after price", c: BLUE },
]);
notes[3] = "Drivers are consistent and actionable: contract type dominates, followed by payment method, missing support/security add-ons, and fiber service.";

// ================= Slide 4 — Tenure =================
s = p.addSlide();
title(s, "Churn is front-loaded in the first months");
s.addImage({ path: "figures/tenure_curve.png", x: 0.6, y: 1.7, w: 6.6, h: 3.77 });
statCard(s, 7.8, 2.2, 4.9, 1.5, "52.9%", RED, "of new customers churn in their first 6 months");
s.addText("Retention can't start at renewal — it has to start at onboarding. The first six months are where the losses happen.",
  { x: 7.8, y: 4.0, w: 4.9, h: 1.4, fontFace: BODY_F, fontSize: 16, color: INK, margin: 0, valign: "top" });
notes[4] = "More than half of new customers leave within six months. The intervention window is onboarding, not renewal.";

// ================= Slide 5 — Prediction =================
s = p.addSlide();
title(s, "We can predict who's about to leave");
s.addImage({ path: "figures/risk_deciles.png", x: 0.6, y: 1.7, w: 6.6, h: 3.77 });
statCard(s, 7.8, 2.2, 2.35, 1.9, "0.85", BLUE, "model AUC");
statCard(s, 10.3, 2.2, 2.35, 1.9, "67%", GREEN, "of churn in top 30% risk");
s.addText("A logistic-regression model scores every customer, so retention budget can be aimed at the few hundred people who actually matter — not sprayed across the base.",
  { x: 7.8, y: 4.35, w: 4.85, h: 1.3, fontFace: BODY_F, fontSize: 15, color: INK, margin: 0, valign: "top" });
notes[5] = "The model (AUC 0.85) concentrates two-thirds of churn into the top 30% of customers by risk — the basis for efficient targeting.";

// ================= Slide 6 — ROI =================
s = p.addSlide();
title(s, "The business case: a targeted retention play");
s.addImage({ path: "figures/roi_waterfall.png", x: 0.6, y: 1.7, w: 6.6, h: 3.77 });
bullets(s, 7.6, 2.0, 5.3, [
  { h: "Target 2,113 highest-risk customers", d: "(top 30%)", c: BLUE },
  { h: "Save ~501 of them", d: "at a 30% offer-acceptance rate", c: GREEN },
  { h: "$347K net benefit / year", d: "on $127K campaign spend", c: GREEN },
  { h: "2.7x ROI", d: "still positive at a 15% save rate", c: GREEN },
]);
notes[6] = "Base case: $60 offer to the top 30% risk, 30% save rate → $347K net, 2.7x ROI. Sensitivity stays positive down to a 15% save rate.";

// ================= Slide 7 — Recommendation (dark) =================
s = p.addSlide();
s.background = { color: NAVY };
s.addText("Recommendation", { x: 0.7, y: 0.5, w: 11, h: 0.9, fontFace: TITLE_F,
  fontSize: 32, bold: true, color: WHITE, margin: 0 });
const recs = [
  ["1", "Aim, don't spray.", "Run retention against the top 30% risk — 67% of churn, ~2x budget efficiency."],
  ["2", "Attack contract type.", "Incentivize high-risk month-to-month customers onto 1–2 year terms."],
  ["3", "Fix the first six months.", "Invest in onboarding and bundle tech support / online security (both halve churn)."],
  ["4", "Move e-check payers to autopay.", "The single highest-churn payment method."],
];
let yy = 1.7;
recs.forEach(([n, h, d]) => {
  s.addShape(p.ShapeType.ellipse, { x: 0.75, y: yy, w: 0.62, h: 0.62, fill: { color: BLUE } });
  s.addText(n, { x: 0.75, y: yy, w: 0.62, h: 0.62, fontFace: TITLE_F, fontSize: 24,
    bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: h + "  ", options: { bold: true, color: WHITE } },
    { text: d, options: { color: ICE } },
  ], { x: 1.6, y: yy - 0.05, w: 8.0, h: 0.72, fontFace: BODY_F, fontSize: 16,
    align: "left", valign: "middle", margin: 0 });
  yy += 0.9;
});
s.addShape(p.ShapeType.roundRect, { x: 9.9, y: 1.7, w: 2.75, h: 3.3, fill: { color: "0A1626" },
  rectRadius: 0.12, line: { color: BLUE, width: 1.25 } });
s.addText("$347K", { x: 9.95, y: 2.2, w: 2.65, h: 1.0, fontFace: TITLE_F, fontSize: 40,
  bold: true, color: GREEN, align: "center", margin: 0 });
s.addText("net / year", { x: 9.95, y: 3.1, w: 2.65, h: 0.4, fontFace: BODY_F, fontSize: 14,
  color: ICE, align: "center", margin: 0 });
s.addText("2.7x", { x: 9.95, y: 3.7, w: 2.65, h: 0.8, fontFace: TITLE_F, fontSize: 34,
  bold: true, color: WHITE, align: "center", margin: 0 });
s.addText("return on spend", { x: 9.95, y: 4.5, w: 2.65, h: 0.4, fontFace: BODY_F, fontSize: 14,
  color: ICE, align: "center", margin: 0 });
s.addText("Validate the save-rate assumption with a small A/B holdout before scaling.",
  { x: 0.75, y: 5.7, w: 8.7, h: 0.6, fontFace: BODY_F, fontSize: 14, italic: true, color: ICE, margin: 0 });
notes[7] = "Four moves, one number: ~$347K net/year. Validate with an A/B holdout before full rollout.";

Object.entries(notes).forEach(([i, t]) => p.slides[i - 1].addNotes(t));

p.writeFile({ fileName: "Churn_Retention_Readout.pptx" }).then(f => console.log("wrote", f));
