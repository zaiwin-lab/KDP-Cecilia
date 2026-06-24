/* ToyyibPay server-to-server callback. On success, flags the lead as Paid.
   Posts: status_id (1=success), billcode, order_id (= our ref), amount, ... */
import { getStore } from "@netlify/blobs";

export default async (req) => {
  let params = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) params = await req.json();
    else params = Object.fromEntries(new URLSearchParams(await req.text()));
  } catch (_) {}

  const status = String(params.status_id ?? params.status ?? "");
  const ref = String(params.order_id || params.billExternalReferenceNo || "");
  if (status === "1" && ref) {
    const id = ref.split("-").slice(0, -1).join("-");   // strip trailing timestamp
    if (id) {
      try {
        const store = getStore("submissions");
        const rec = await store.get(id, { type: "json" });
        if (rec) {
          rec.paid = true;
          rec.paidAt = new Date().toISOString();
          rec.paidAmount = Number(params.amount) ? Number(params.amount) / 100 : rec.paidAmount;
          rec.billCode = params.billcode || rec.billCode;
          rec.status = "Paid";
          await store.setJSON(id, rec);
        }
      } catch (_) {}
    }
  }
  return new Response("OK", { status: 200 });
};
