import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../lib/api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api("/orders/mine").then(setOrders); }, []);
  if (orders.length === 0) return <div className="p-16 text-center text-stone-500">No orders yet.</div>;
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="font-display text-3xl mb-6">My Orders</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`} className="block bg-white border rounded p-4 hover:shadow">
            <div className="flex justify-between text-sm">
              <span className="font-mono">{o.orderNo}</span>
              <span className="text-stone-500">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-sm text-stone-600">{o.items.length} item(s) · {o.orderStatus}</span>
              <span className="font-semibold">{money(o.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
