import { Link } from "react-router-dom";
import { money } from "../lib/api.js";
import { imageUrl } from "../lib/images.js";

export default function ProductCard({ p }) {
  return (
    <Link to={`/product/${p.slug}`} className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200">
        <span className="absolute inset-0 grid place-items-center px-5 text-center font-display text-2xl text-brand-dark/60">{p.title}</span>
        {p.discountPrice && <span className="absolute left-3 top-3 z-20 rounded-full bg-brand-dark px-2.5 py-1 text-xs font-semibold text-white">Sale</span>}
        <img src={imageUrl(p.images?.[0], p.title)} alt={p.title} className="relative z-10 h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
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
