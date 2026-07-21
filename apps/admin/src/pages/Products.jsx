import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Products() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => {
    const url = user.role === "admin" ? "/products?limit=200" : "/products/vendor/mine";
    api(url).then((d) => setItems(d.items || d));
  };
  useEffect(() => { load(); api("/categories").then(setCats); }, []);

  const save = async (e) => {
    e.preventDefault();
    const f = editing;
    const body = { ...f, price: +f.price, discountPrice: +f.discountPrice || undefined, stock: +f.stock, images: (f.imagesStr || "").split(",").map(s => s.trim()).filter(Boolean) };
    if (f._id) await api(`/products/${f._id}`, { method: "PUT", body });
    else await api("/products", { method: "POST", body });
    setEditing(null); load();
  };

  const del = async (id) => { if (!confirm("Delete?")) return; await api(`/products/${id}`, { method: "DELETE" }); load(); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setEditing({ title: "", description: "", price: 0, stock: 0, categoryId: cats[0]?._id, imagesStr: "" })} className="bg-slate-900 text-white px-4 py-2 rounded">+ New Product</button>
      </div>
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Product</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3 flex gap-2 items-center"><img src={p.images?.[0]} className="w-10 h-10 rounded object-cover" alt="" /><span>{p.title}</span></td>
                <td>₹{p.discountPrice || p.price}</td>
                <td>{p.stock}</td>
                <td>{p.approvalStatus}</td>
                <td className="text-right pr-3">
                  <button onClick={() => setEditing({ ...p, imagesStr: (p.images || []).join(", ") })} className="text-sky-700 mr-2">Edit</button>
                  <button onClick={() => del(p._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form onSubmit={save} className="bg-white rounded p-6 w-full max-w-lg space-y-3">
            <h3 className="font-semibold">{editing._id ? "Edit" : "New"} Product</h3>
            <input required placeholder="Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full border rounded px-3 py-2" />
            <textarea placeholder="Description" value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full border rounded px-3 py-2 h-20" />
            <div className="grid grid-cols-3 gap-2">
              <input required type="number" placeholder="Price" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} className="border rounded px-3 py-2" />
              <input type="number" placeholder="Discount price" value={editing.discountPrice || ""} onChange={e => setEditing({ ...editing, discountPrice: e.target.value })} className="border rounded px-3 py-2" />
              <input required type="number" placeholder="Stock" value={editing.stock} onChange={e => setEditing({ ...editing, stock: e.target.value })} className="border rounded px-3 py-2" />
            </div>
            <select value={editing.categoryId || ""} onChange={e => setEditing({ ...editing, categoryId: e.target.value })} className="w-full border rounded px-3 py-2">
              {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input placeholder="Image URLs (comma-separated)" value={editing.imagesStr} onChange={e => setEditing({ ...editing, imagesStr: e.target.value })} className="w-full border rounded px-3 py-2" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2">Cancel</button>
              <button className="bg-slate-900 text-white px-4 py-2 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
