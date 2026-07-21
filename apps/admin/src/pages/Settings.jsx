import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function Settings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { api("/settings").then(setS); }, []);
  const save = async (e) => { e.preventDefault(); await api("/settings", { method: "PUT", body: s }); setMsg("Saved ✓"); setTimeout(() => setMsg(""), 2000); };
  if (!s) return <div>Loading…</div>;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Website Settings</h1>
      <form onSubmit={save} className="bg-white p-6 rounded border space-y-3">
        {["businessName", "contactEmail", "contactPhone", "address", "logo"].map(k => (
          <div key={k}><label className="text-xs uppercase text-slate-500">{k}</label><input value={s[k] || ""} onChange={e => setS({ ...s, [k]: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
        ))}
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-xs uppercase text-slate-500">Tax %</label><input type="number" value={s.tax} onChange={e => setS({ ...s, tax: +e.target.value })} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="text-xs uppercase text-slate-500">Shipping ₹</label><input type="number" value={s.shipping} onChange={e => setS({ ...s, shipping: +e.target.value })} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="text-xs uppercase text-slate-500">Free Ship Above ₹</label><input type="number" value={s.freeShippingAbove} onChange={e => setS({ ...s, freeShippingAbove: +e.target.value })} className="w-full border rounded px-3 py-2" /></div>
        </div>
        <div><label className="text-xs uppercase text-slate-500">Commission %</label><input type="number" value={s.commission} onChange={e => setS({ ...s, commission: +e.target.value })} className="w-full border rounded px-3 py-2" /></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={s.maintenanceMode} onChange={e => setS({ ...s, maintenanceMode: e.target.checked })} /> Maintenance mode</label>
        <button className="bg-slate-900 text-white px-4 py-2 rounded">Save Settings</button>
        {msg && <span className="ml-3 text-emerald-700">{msg}</span>}
      </form>
    </div>
  );
}
