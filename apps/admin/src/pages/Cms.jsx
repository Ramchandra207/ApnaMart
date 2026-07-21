import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function Cms() {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api("/cms/pages").then(setPages);
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    let sections = [];
    try { sections = JSON.parse(editing.sectionsStr || "[]"); } catch { alert("Invalid JSON"); return; }
    await api(`/cms/pages/${editing.slug}`, { method: "PUT", body: { title: editing.title, sections, seo: editing.seo || {} } });
    setEditing(null); load();
  };
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">CMS Pages</h1>
        <button onClick={() => setEditing({ slug: "", title: "", sectionsStr: "[]" })} className="bg-slate-900 text-white px-4 py-2 rounded">+ New Page</button>
      </div>
      <div className="bg-white border rounded divide-y">
        {pages.map(p => (
          <div key={p._id} className="p-4 flex justify-between items-center">
            <div><div className="font-semibold">{p.title}</div><div className="text-xs text-slate-500 font-mono">/{p.slug}</div></div>
            <button onClick={() => setEditing({ ...p, sectionsStr: JSON.stringify(p.sections, null, 2) })} className="text-sky-700">Edit</button>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form onSubmit={save} className="bg-white rounded p-6 w-full max-w-2xl space-y-3">
            <h3 className="font-semibold">{editing._id ? "Edit" : "New"} Page</h3>
            <input required placeholder="Slug (e.g. about)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full border rounded px-3 py-2" disabled={!!editing._id} />
            <input required placeholder="Title" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full border rounded px-3 py-2" />
            <textarea placeholder="Sections JSON" value={editing.sectionsStr} onChange={e => setEditing({ ...editing, sectionsStr: e.target.value })} className="w-full border rounded px-3 py-2 font-mono text-xs h-64" />
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
