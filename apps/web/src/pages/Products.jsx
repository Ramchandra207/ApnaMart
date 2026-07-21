import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "-createdAt";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const page = params.get("page") || "1";

  useEffect(() => { api("/categories", { auth: false }).then(setCategories); }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({ page, limit: "12" });
    if (q) qs.set("q", q);
    if (category) qs.set("category", category);
    if (sort) qs.set("sort", sort);
    if (minPrice) qs.set("minPrice", minPrice);
    if (maxPrice) qs.set("maxPrice", maxPrice);
    api(`/products?${qs}`, { auth: false }).then(setData).finally(() => setLoading(false));
  }, [q, category, sort, minPrice, maxPrice, page]);

  const update = (k, v) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v); else p.delete(k);
    p.set("page", "1");
    setParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-8">
      <aside className="space-y-6">
        <div>
          <label className="text-xs uppercase text-stone-500">Search</label>
          <input value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search products…" className="mt-1 w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <div className="text-xs uppercase text-stone-500 mb-1">Category</div>
          <button onClick={() => update("category", "")} className={`block text-sm py-1 ${!category ? "font-semibold" : ""}`}>All</button>
          {categories.map((c) => (
            <button key={c._id} onClick={() => update("category", c._id)} className={`block text-sm py-1 ${category === c._id ? "font-semibold" : ""}`}>{c.name}</button>
          ))}
        </div>
        <div>
          <div className="text-xs uppercase text-stone-500 mb-1">Price</div>
          <div className="flex gap-2">
            <input placeholder="Min" defaultValue={minPrice} onBlur={(e) => update("minPrice", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
            <input placeholder="Max" defaultValue={maxPrice} onBlur={(e) => update("maxPrice", e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-stone-500 mb-1">Sort</div>
          <select value={sort} onChange={(e) => update("sort", e.target.value)} className="w-full border rounded px-2 py-2 text-sm">
            <option value="-createdAt">Newest</option>
            <option value="price">Price low → high</option>
            <option value="-price">Price high → low</option>
            <option value="-rating">Top rated</option>
          </select>
        </div>
      </aside>

      <section>
        <div className="mb-4 text-sm text-stone-500">{data.total} products</div>
        {loading ? <div className="text-stone-500">Loading…</div> : data.items.length === 0 ? (
          <div className="text-stone-500">No products match your filters.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.items.map((p) => <ProductCard key={p._id} p={p} />)}
          </div>
        )}
        {data.pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => update("page", String(n))} className={`w-9 h-9 rounded ${String(n) === page ? "bg-brand text-white" : "bg-white border"}`}>{n}</button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
