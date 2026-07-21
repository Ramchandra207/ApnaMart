import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const load = () => api(user.role === "admin" ? "/orders" : "/orders/vendor/mine").then(setOrders);
  useEffect(() => { load(); }, []);
  const setStatus = async (id, status) => { await api(`/orders/${id}/status`, { method: "PUT", body: { status, note: `Status → ${status}` } }); load(); };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-mono">{o.orderNo}</td>
                <td>{o.userId?.name}</td>
                <td>{money(o.total)}</td>
                <td>{o.paymentMode}</td>
                <td><span className="px-2 py-1 rounded bg-slate-100 text-xs">{o.orderStatus}</span></td>
                <td>
                  <select value={o.orderStatus} onChange={e => setStatus(o._id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
