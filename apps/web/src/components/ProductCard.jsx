import { Link } from "react-router-dom";
import { money } from "../lib/api.js";

export default function ProductCard({ p }) {
  return (
    <Link to={`/product/${p.slug}`} className="group block bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-lg transition">
      <div className="aspect-square bg-stone-100 overflow-hidden">
        <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
      </div>
      <div className="p-3">
        <div className="text-xs text-stone-500">{p.vendorId?.storeName}</div>
        <div className="font-medium text-sm truncate">{p.title}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-brand-dark">{money(p.discountPrice || p.price)}</span>
          {p.discountPrice && <span className="text-xs text-stone-400 line-through">{money(p.price)}</span>}
        </div>
        {p.rating > 0 && <div className="text-xs text-amber-600 mt-1">★ {p.rating.toFixed(1)} ({p.numReviews})</div>}
      </div>
    </Link>
  );
}
