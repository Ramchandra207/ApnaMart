import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function Vendors() {
  const [items, setItems] = useState([]);
  const load = () => api("/vendors?all=true").then(setItems);
  useEffect(() => { load(); }, []);
  const setStatus = async (id, status) => { await api(`/vendors/${id}/approve`, { method: "PUT", body: { status } }); load(); };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendors</h1>
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Store</th><th>Owner</th><th>Status</th><th>Commission</th><th></th></tr></thead>
          <tbody>
            {items.map(v => (
              <tr key={v._id} className="border-t">
                <td className="p-3">{v.storeName}</td><td>{v.userId?.name}</td>
                <td><span className="px-2 py-1 rounded bg-slate-100 text-xs">{v.approvalStatus}</span></td>
                <td>{v.commission}%</td>
                <td className="text-right pr-3 space-x-2">
                  <button onClick={() => setStatus(v._id, "approved")} className="text-emerald-700">Approve</button>
                  <button onClick={() => setStatus(v._id, "rejected")} className="text-red-600">Reject</button>
                  <button onClick={() => setStatus(v._id, "suspended")} className="text-amber-700">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
