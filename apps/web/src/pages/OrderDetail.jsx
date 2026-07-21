import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, money } from "../lib/api.js";

export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  useEffect(() => { api(`/orders/${id}`).then(setO); }, [id]);
  if (!o) return <div className="p-16 text-center text-stone-500">Loading…</div>;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-baseline">
        <h2 className="font-display text-3xl">Order {o.orderNo}</h2>
        <span className="text-sm px-3 py-1 rounded-full bg-stone-100 border">{o.orderStatus}</span>
      </div>
      <div className="text-sm text-stone-500 mt-1">Placed {new Date(o.createdAt).toLocaleString()}</div>

      <div className="mt-6 bg-white border rounded p-4">
        <h3 className="font-semibold mb-2">Items</h3>
        {o.items.map((i, idx) => (
          <div key={idx} className="flex gap-3 py-2 border-b last:border-b-0">
            <img src={i.image} alt="" className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-stone-500">Qty {i.qty} × {money(i.price)}</div>
            </div>
            <div>{money(i.subtotal)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <div className="text-sm text-stone-700">
            {o.address?.fullName}<br />
            {o.address?.line1}<br />
            {o.address?.city}, {o.address?.state} {o.address?.pincode}<br />
            {o.address?.phone}
          </div>
        </div>
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-2">Payment</h3>
          <div className="text-sm">{o.paymentMode.toUpperCase()} — {o.paymentStatus}</div>
          <div className="mt-3 text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
            {o.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−{money(o.discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{money(o.shipping)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{money(o.tax)}</span></div>
            <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>{money(o.total)}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded p-4">
        <h3 className="font-semibold mb-2">Timeline</h3>
        <ul className="text-sm space-y-1">
          {o.timeline?.map((t, i) => (
            <li key={i} className="flex gap-3"><span className="text-stone-500 w-40">{new Date(t.at).toLocaleString()}</span><span className="font-medium">{t.status}</span> <span className="text-stone-600">{t.note}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
