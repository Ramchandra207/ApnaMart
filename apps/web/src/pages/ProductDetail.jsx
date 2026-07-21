import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, money } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const [p, setP] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [enq, setEnq] = useState({ subject: "Quote request", message: "", quantity: 10, open: false });

  useEffect(() => {
    api(`/products/${slug}`, { auth: false }).then((doc) => {
      setP(doc);
      api(`/reviews/product/${doc._id}`, { auth: false }).then(setReviews);
    });
  }, [slug]);

  if (!p) return <div className="p-16 text-center text-stone-500">Loading…</div>;

  const handleAdd = async () => {
    if (!user) { setMsg("Please login to add to cart"); return; }
    await add(p._id, qty);
    setMsg("Added to cart ✓");
  };

  const submitEnquiry = async (e) => {
    e.preventDefault();
    if (!user) { setMsg("Please login to send enquiry"); return; }
    await api("/enquiries", { method: "POST", body: { vendorId: p.vendorId._id, productId: p._id, subject: enq.subject, message: enq.message, quantity: enq.quantity, type: "quote" } });
    setEnq({ ...enq, open: false, message: "" });
    setMsg("Enquiry sent ✓");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
            <img src={p.images?.[img]} alt={p.title} className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {p.images?.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} className={`aspect-square rounded overflow-hidden border ${i === img ? "border-brand" : "border-stone-200"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm text-stone-500">
            <Link to={`/vendor/${p.vendorId?.slug}`} className="hover:underline">{p.vendorId?.storeName}</Link>
            {" · "}{p.categoryId?.name}
          </div>
          <h1 className="font-display text-3xl mt-1">{p.title}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-brand-dark">{money(p.discountPrice || p.price)}</span>
            {p.discountPrice && <span className="text-stone-400 line-through">{money(p.price)}</span>}
            {p.rating > 0 && <span className="text-amber-600 text-sm">★ {p.rating.toFixed(1)} ({p.numReviews})</span>}
          </div>
          <p className="mt-4 text-stone-700">{p.description}</p>

          {p.variants?.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-stone-500 mb-1">Size</div>
              <div className="flex gap-2">
                {p.variants.map((v) => (
                  <span key={v._id} className="px-3 py-1 border rounded text-sm">{v.size}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <input type="number" min="1" value={qty} onChange={(e) => setQty(+e.target.value || 1)} className="w-20 border rounded px-3 py-2" />
            <button onClick={handleAdd} className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded font-medium">Add to Cart</button>
            <button onClick={() => setEnq({ ...enq, open: !enq.open })} className="px-6 py-3 rounded border font-medium">Ask for Quote</button>
          </div>

          {msg && <div className="mt-3 text-sm text-emerald-700">{msg}</div>}
          <div className="mt-4 text-sm text-stone-500">Stock: {p.stock > 0 ? `${p.stock} available` : "Out of stock"} · Sold by {p.vendorId?.storeName}</div>

          {enq.open && (
            <form onSubmit={submitEnquiry} className="mt-5 p-4 bg-stone-50 border rounded space-y-3">
              <div className="font-semibold text-sm">Send enquiry / bulk quote</div>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Subject" value={enq.subject} onChange={(e) => setEnq({ ...enq, subject: e.target.value })} />
              <input className="w-full border rounded px-3 py-2 text-sm" type="number" placeholder="Quantity" value={enq.quantity} onChange={(e) => setEnq({ ...enq, quantity: +e.target.value })} />
              <textarea className="w-full border rounded px-3 py-2 text-sm h-24" placeholder="Message" value={enq.message} onChange={(e) => setEnq({ ...enq, message: e.target.value })} />
              <button className="bg-stone-900 text-white px-4 py-2 rounded text-sm">Send Enquiry</button>
            </form>
          )}
        </div>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl mb-4">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? <div className="text-stone-500 text-sm">No reviews yet.</div> : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 bg-white border rounded">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{r.userId?.name}</span>
                  <span className="text-amber-600">{"★".repeat(r.rating)}</span>
                </div>
                <div className="text-sm font-medium mt-1">{r.title}</div>
                <div className="text-sm text-stone-600">{r.body}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
