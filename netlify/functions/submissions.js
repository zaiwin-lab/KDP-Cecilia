/* shared data store (Netlify Blobs) + instant WhatsApp alert on new leads.
   GET  ?id=  -> minimal contact (strong consistency, for checkout autofill)
   GET        -> all records (dashboard)
   POST       -> save one record; fires WATI alert only on a genuinely-new id
   DELETE ?id -> delete one record
   Env: WATI_ENDPOINT, WATI_TOKEN, WATI_NOTIFY_TO, WATI_TEMPLATE */
import { getStore } from "@netlify/blobs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status, headers: { "content-type": "application/json", "cache-control": "no-store" }
  });

async function notifyNewLead(rec) {
  const endpoint = process.env.WATI_ENDPOINT;
  const token = process.env.WATI_TOKEN;
  const to = process.env.WATI_NOTIFY_TO;
  const template = process.env.WATI_TEMPLATE || "new_chat_v1";
  if (!endpoint || !token || !to) return;

  const biz = rec.businessName || "New business";
  const owner = rec.ownerName || "—";
  const district = rec.district || "—";
  const mobile = rec.mobile || "—";
  const score = (rec.leadScore != null ? rec.leadScore : (rec.summary && rec.summary.leadScore)) ?? "—";
  const clean = (s) => String(s).replace(/\s+/g, " ").trim();

  let parameters;
  if (template === "new_chat_v1") {
    const summary = clean(`NEW LEAD 🔔 ${biz} · ${owner} · ${district} · 📱${mobile} · ⭐${score}/100`);
    parameters = [{ name: "name", value: summary }];
  } else {
    parameters = [
      { name: "name", value: clean(owner) },
      { name: "business", value: clean(biz) },
      { name: "district", value: clean(district) },
      { name: "mobile", value: clean(mobile) },
      { name: "score", value: clean(score) }
    ];
  }

  const url = endpoint.replace(/\/+$/, "") +
    "/api/v1/sendTemplateMessage?whatsappNumber=" + encodeURIComponent(to);
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ template_name: template, broadcast_name: "lead_" + Date.now(), parameters })
  });
  if (!res.ok) console.error("WATI notify failed", res.status, (await res.text().catch(()=> "")).slice(0,300));
}

export default async (req) => {
  const store = getStore("submissions");

  if (req.method === "GET") {
    const qid = new URL(req.url).searchParams.get("id");
    if (qid) {
      const rec = await store.get(String(qid), { type: "json", consistency: "strong" }).catch(() => null);
      if (!rec) return json(null, 404);
      return json({
        id: rec.id, businessName: rec.businessName || "", ownerName: rec.ownerName || "",
        email: rec.email || "", mobile: rec.mobile || ""
      });
    }
    const { blobs } = await store.list();
    const records = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" }).catch(() => null)));
    return json(records.filter(Boolean));
  }

  if (req.method === "POST") {
    let rec;
    try { rec = await req.json(); } catch (_) { return json({ error: "bad JSON" }, 400); }
    if (!rec || !rec.id) return json({ error: "missing id" }, 400);
    const existing = await store.get(String(rec.id), { consistency: "strong" }).catch(() => null);
    await store.setJSON(String(rec.id), rec);
    if (!existing && rec.businessName) {
      try { await notifyNewLead(rec); } catch (e) { console.error("notify threw", e && e.message); }
    }
    return json({ ok: true, id: rec.id });
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (id) await store.delete(String(id));
    return json({ ok: true });
  }
  return json({ error: "method not allowed" }, 405);
};
