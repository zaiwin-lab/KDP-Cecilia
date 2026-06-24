/* Creates a ToyyibPay bill (FPX/card) and returns { url } to redirect to.
   Env: TOYYIBPAY_SECRET, TOYYIBPAY_CATEGORY, (optional) TOYYIBPAY_BASE, BRAND_PREFIX */
const BRAND = process.env.BRAND_PREFIX || "CECILIA";       // per-client label
const FALLBACK_EMAIL = "";                                  // leave blank; ToyyibPay will prompt

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { "content-type": "application/json", "cache-control": "no-store" }
  });

const clean = (s, max) =>
  String(s || "").replace(/['‘’`]/g, "").replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const normPhone = (s) => { let d = String(s || "").replace(/\D/g, ""); if (d.startsWith("60")) d = "0" + d.slice(2); return d; };
const validEmail = (s) => /^\S+@\S+\.\S+$/.test(String(s || ""));

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const secret = process.env.TOYYIBPAY_SECRET;
  const category = process.env.TOYYIBPAY_CATEGORY;
  const base = (process.env.TOYYIBPAY_BASE || "https://toyyibpay.com").replace(/\/+$/, "");
  if (!secret || !category) return json({ error: "not_configured" }, 503);

  let o; try { o = await req.json(); } catch (_) { return json({ error: "bad JSON" }, 400); }
  const amount = Math.round(Number(o.amount) * 100);
  if (!amount || amount < 100) return json({ error: "bad amount" }, 400);

  const origin = new URL(req.url).origin;
  const ref = (o.id ? String(o.id) : BRAND) + "-" + Date.now();
  const billName = clean(BRAND + " " + (o.business || "Website"), 30) || (BRAND + " Website");
  const billDesc = clean(o.description || "Website activation and add ons", 100) || "Website activation";

  const form = new URLSearchParams({
    userSecretKey: secret, categoryCode: category, billName, billDescription: billDesc,
    billPriceSetting: "1", billPayorInfo: "1", billAmount: String(amount),
    billReturnUrl: origin + "/pay.html?paid=1",
    billCallbackUrl: origin + "/.netlify/functions/payment-callback",
    billExternalReferenceNo: ref,
    billTo: clean(o.owner || o.business || "Customer", 50) || "Customer",
    billEmail: validEmail(o.email) ? o.email : FALLBACK_EMAIL,
    billPhone: normPhone(o.phone),
    billPaymentChannel: "2"
  });

  let data;
  try {
    const res = await fetch(base + "/index.php/api/createBill", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form.toString()
    });
    data = await res.json().catch(() => null);
  } catch (e) { return json({ error: "gateway_unreachable" }, 502); }

  const code = Array.isArray(data) && data[0] && data[0].BillCode;
  if (!code) return json({ error: "create_failed", detail: data }, 502);
  return json({ url: base + "/" + code, billCode: code, ref });
};
