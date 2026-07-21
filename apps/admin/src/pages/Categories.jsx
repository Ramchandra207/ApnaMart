import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function Categories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", image: "" });
  const load = () => api("/categories").then(setItems);
  useEffect(() => { load(); }, []);
  const create = async (e) => { e.preventDefault(); await api("/categories", { method: "POST", body: form }); setForm({ name: "", image: "" }); load(); };
  const del = async (id) => { if (!confirm("Delete?")) return; await api(`/categories/${id}`, { method: "DELETE" }); load(); };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={create} className="bg-white p-4 rounded border mb-4 flex gap-2">
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2 flex-1" />
        <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="border rounded px-3 py-2 flex-1" />
        <button className="bg-slate-900 text-white px-4 py-2 rounded">Add</button>
      </form>
      <div className="grid grid-cols-4 gap-3">
        {items.map(c => (
          <div key={c._id} className="bg-white rounded border overflow-hidden">
            <img src={c.image} className="h-24 w-full object-cover" alt="" />
            <div className="p-3 flex justify-between items-center"><span className="font-medium">{c.name}</span><button onClick={() => del(c._id)} className="text-red-600 text-sm">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
