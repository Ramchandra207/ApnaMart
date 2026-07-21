import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function Enquiries() {
  const [items, setItems] = useState([]);
  const [replying, setReplying] = useState(null);
  const [msg, setMsg] = useState("");
  const load = () => api("/enquiries/mine").then(setItems);
  useEffect(() => { load(); }, []);
  const reply = async (e) => {
    e.preventDefault();
    await api(`/enquiries/${replying._id}/reply`, { method: "PUT", body: { message: msg } });
    setReplying(null); setMsg(""); load();
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Enquiries & Quotes</h1>
      <div className="space-y-3">
        {items.map(e => (
          <div key={e._id} className="bg-white border rounded p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{e.subject} <span className="text-xs bg-slate-100 rounded px-2 py-0.5 ml-2">{e.status}</span></div>
                <div className="text-sm text-slate-500">{e.customerId?.name} · {e.productId?.title} · Qty {e.quantity}</div>
                <div className="text-sm mt-2">{e.message}</div>
              </div>
              <button onClick={() => setReplying(e)} className="text-sky-700 text-sm">Reply</button>
            </div>
            {e.replies?.length > 0 && (
              <div className="mt-3 pl-3 border-l-2 text-sm space-y-1">
                {e.replies.map((r, i) => <div key={i} className="text-slate-700">↳ {r.message}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {replying && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4">
          <form onSubmit={reply} className="bg-white p-6 rounded w-full max-w-md space-y-3">
            <h3 className="font-semibold">Reply to {replying.customerId?.name}</h3>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Your reply…" className="w-full border rounded px-3 py-2 h-32" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setReplying(null)} className="px-4 py-2">Cancel</button>
              <button className="bg-slate-900 text-white px-4 py-2 rounded">Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
