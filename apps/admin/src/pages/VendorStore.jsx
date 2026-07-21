import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function VendorStore() {
  const [v, setV] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { api("/vendors/me/store").then(setV); }, []);
  const save = async (e) => { e.preventDefault(); const u = await api(`/vendors/${v._id}`, { method: "PUT", body: v }); setV(u); setMsg("Saved ✓"); setTimeout(() => setMsg(""), 2000); };
  if (!v) return <div>Loading… (no vendor profile? Ask admin to create.)</div>;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">My Store</h1>
      <form onSubmit={save} className="bg-white p-6 rounded border space-y-3">
        <div><label className="text-xs uppercase text-slate-500">Store Name</label><input value={v.storeName} onChange={e => setV({ ...v, storeName: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
        <div><label className="text-xs uppercase text-slate-500">Description</label><textarea value={v.description || ""} onChange={e => setV({ ...v, description: e.target.value })} className="w-full border rounded px-3 py-2 h-20" /></div>
        <div><label className="text-xs uppercase text-slate-500">Logo URL</label><input value={v.logo || ""} onChange={e => setV({ ...v, logo: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
        <div><label className="text-xs uppercase text-slate-500">Banner URL</label><input value={v.banner || ""} onChange={e => setV({ ...v, banner: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
        <div className="text-sm text-slate-500">Approval status: <b>{v.approvalStatus}</b></div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded">Save</button>
        {msg && <span className="ml-3 text-emerald-700">{msg}</span>}
      </form>
    </div>
  );
}
