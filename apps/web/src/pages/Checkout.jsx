import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, money } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const nav = useNavigate();
  const [addr, setAddr] = useState({ fullName: user?.name || "", phone: "", line1: "", city: "", state: "", pincode: "" });
  const [paymentMode, setPaymentMode] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + (i.priceAtAdd || 0) * i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax;

  useEffect(() => {
    if (user?.addresses?.length) {
      const d = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddr(d);
    }
  }, [user]);

  const applyCoupon = async () => {
    setError("");
    try {
      const d = await api("/coupons/apply", { method: "POST", body: { code: coupon, subtotal } });
      setDiscount(d.discount);
    } catch (e) { setError(e.message); setDiscount(0); }
  };

  const placeOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      const o = await api("/orders", { method: "POST", body: { address: addr, paymentMode, couponCode: coupon || undefined } });
      await refresh();
      nav(`/orders/${o._id}`);
    } catch (e) { setError(e.message); }
    finally { setPlacing(false); }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-6">
        <section className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-3">Delivery Address</h3>
          <div className="grid grid-cols-2 gap-3">
            {["fullName", "phone", "line1", "city", "state", "pincode"].map((k) => (
              <input key={k} placeholder={k} value={addr[k] || ""} onChange={(e) => setAddr({ ...addr, [k]: e.target.value })} className="border rounded px-3 py-2 text-sm" />
            ))}
          </div>
        </section>

        <section className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-3">Payment</h3>
          <label className="flex items-center gap-2 mb-2"><input type="radio" checked={paymentMode === "cod"} onChange={() => setPaymentMode("cod")} /> Cash on Delivery</label>
          <label className="flex items-center gap-2"><input type="radio" checked={paymentMode === "online"} onChange={() => setPaymentMode("online")} /> Online Payment (demo)</label>
        </section>

        <section className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-3">Coupon</h3>
          <div className="flex gap-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 border rounded px-3 py-2 text-sm" />
            <button onClick={applyCoupon} className="px-4 py-2 rounded bg-stone-900 text-white text-sm">Apply</button>
          </div>
          {discount > 0 && <div className="mt-2 text-sm text-emerald-700">Coupon applied — you save {money(discount)}</div>}
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </section>
      </div>

      <aside className="bg-white border rounded p-4 h-fit">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="text-sm space-y-1">
          {items.map((i) => (
            <div key={i._id} className="flex justify-between"><span className="truncate pr-2">{i.productId?.title} × {i.qty}</span><span>{money(i.priceAtAdd * i.qty)}</span></div>
          ))}
        </div>
        <hr className="my-3" />
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>−{money(discount)}</span></div>}
          <div className="flex justify-between"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
          <div className="flex justify-between"><span>Tax (5%)</span><span>{money(tax)}</span></div>
          <div className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span>{money(total)}</span></div>
        </div>
        <button disabled={placing || items.length === 0} onClick={placeOrder} className="mt-4 w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white py-3 rounded font-medium">
          {placing ? "Placing…" : "Place Order"}
        </button>
      </aside>
    </div>
  );
}
