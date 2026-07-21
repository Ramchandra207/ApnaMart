import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { money } from "../lib/api.js";

export default function Cart() {
  const { cart, updateQty, remove } = useCart();
  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + (i.priceAtAdd || i.productId?.price || 0) * i.qty, 0);

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto p-16 text-center">
        <h2 className="font-display text-3xl">Your cart is empty</h2>
        <p className="text-stone-500 mt-2">Add some fashion finds to get started.</p>
        <Link to="/products" className="inline-block mt-6 bg-brand text-white px-6 py-3 rounded">Shop Products</Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i._id} className="flex gap-4 bg-white p-3 border rounded">
            <img src={i.productId?.images?.[0]} alt="" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-medium">{i.productId?.title}</div>
              <div className="text-sm text-stone-500">{money(i.priceAtAdd)}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => updateQty(i._id, Math.max(1, i.qty - 1))} className="w-7 h-7 border rounded">−</button>
                <span className="w-8 text-center">{i.qty}</span>
                <button onClick={() => updateQty(i._id, i.qty + 1)} className="w-7 h-7 border rounded">+</button>
                <button onClick={() => remove(i._id)} className="ml-3 text-sm text-red-600">Remove</button>
              </div>
            </div>
            <div className="font-semibold">{money(i.priceAtAdd * i.qty)}</div>
          </div>
        ))}
      </div>
      <aside className="bg-white p-4 border rounded h-fit">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="flex justify-between text-sm py-1"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="flex justify-between text-sm py-1 text-stone-500"><span>Shipping</span><span>Calculated at checkout</span></div>
        <Link to="/checkout" className="mt-4 block text-center bg-brand hover:bg-brand-dark text-white py-3 rounded font-medium">Checkout</Link>
      </aside>
    </div>
  );
}
