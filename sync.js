/* =====================================================================
   sync.js — thin client for the shared submissions store.
   Talks to /.netlify/functions/submissions. Fail-safe: if the network/
   function is unavailable it returns gracefully so localStorage keeps the
   app working. Exposes window.SDC_SYNC.
   ===================================================================== */
(function () {
  "use strict";
  var API = "/.netlify/functions/submissions";

  async function push(record) {
    if (!record || !record.id) return false;
    try {
      var res = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record)
      });
      return res.ok;
    } catch (_) { return false; }
  }

  async function pull() {
    try {
      var res = await fetch(API, { headers: { "cache-control": "no-store" } });
      if (!res.ok) return null;
      var data = await res.json();
      return Array.isArray(data) ? data : null;
    } catch (_) { return null; }
  }

  async function remove(id) {
    if (!id) return false;
    try {
      var res = await fetch(API + "?id=" + encodeURIComponent(id), { method: "DELETE" });
      return res.ok;
    } catch (_) { return false; }
  }

  window.SDC_SYNC = { push: push, pull: pull, remove: remove };
})();
