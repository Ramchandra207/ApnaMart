import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function Coupons() {
  const [items, setItems] = useState([]);
  const [f, setF] = useState({ code: "", type: "percent", value: 10, minOrder: 0 });
  const load = () => api("/coupons").then(setItems);
  useEffect(() => { load(); }, []);
  const create = async (e) => { e.preventDefault(); await api("/coupons", { method: "POST", body: { ...f, value: +f.value, minOrder: +f.minOrder } }); load(); };
  const del = async (id) => { await api(`/coupons/${id}`, { method: "DELETE" }); load(); };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>
      <form onSubmit={create} className="bg-white p-4 rounded border flex gap-2 mb-4">
        <input placeholder="CODE" value={f.code} onChange={e => setF({ ...f, code: e.target.value.toUpperCase() })} className="border rounded px-3 py-2" />
        <select value={f.type} onChange={e => setF({ ...f, type: e.target.value })} className="border rounded px-3 py-2"><option value="percent">%</option><option value="flat">Flat</option></select>
        <input type="number" placeholder="Value" value={f.value} onChange={e => setF({ ...f, value: e.target.value })} className="border rounded px-3 py-2 w-24" />
        <input type="number" placeholder="Min order" value={f.minOrder} onChange={e => setF({ ...f, minOrder: e.target.value })} className="border rounded px-3 py-2 w-28" />
        <button className="bg-slate-900 text-white px-4 py-2 rounded">Add</button>
      </form>
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Code</th><th>Type</th><th>Value</th><th>Min</th><th>Used</th><th></th></tr></thead>
          <tbody>{items.map(c => <tr key={c._id} className="border-t"><td className="p-3 font-mono">{c.code}</td><td>{c.type}</td><td>{c.value}</td><td>{c.minOrder}</td><td>{c.used}</td><td className="text-right pr-3"><button onClick={() => del(c._id)} className="text-red-600">Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
