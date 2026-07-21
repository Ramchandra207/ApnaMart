import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api("/categories", { auth: false }),
      api("/products?featured=true&limit=8", { auth: false }),
      api("/vendors", { auth: false }),
      api("/settings", { auth: false }),
    ]).then(([c, p, v, s]) => {
      setCategories(c);
      setTrending(p.items);
      setVendors(v);
      setSettings(s);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center text-stone-500">Loading…</div>;

  const banner = settings.homepageBanners?.[0];

  return (
    <div>
      {banner && (
        <section className="relative h-[420px] bg-stone-100 overflow-hidden">
          <img src={banner.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-lg">
              <h1 className="font-display text-5xl leading-tight">{banner.title}</h1>
              <p className="mt-3 text-white/80">{banner.subtitle}</p>
              <Link to={banner.cta || "/products"} className="inline-block mt-6 bg-white text-stone-900 px-6 py-3 rounded-full font-medium">Shop now</Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display text-3xl mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link key={c._id} to={`/products?category=${c._id}`} className="group rounded-lg overflow-hidden bg-stone-100 aspect-square relative">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                <span className="text-white font-medium">{c.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-3xl">Trending Now</h2>
          <Link to="/products" className="text-sm text-brand-dark">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display text-3xl mb-6">Top Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <Link key={v._id} to={`/vendor/${v.slug}`} className="p-6 bg-white rounded-lg border hover:shadow flex gap-4 items-center">
              <img src={v.logo} alt="" className="w-16 h-16 rounded-full object-cover bg-stone-100" />
              <div>
                <div className="font-semibold">{v.storeName}</div>
                <div className="text-sm text-stone-500 line-clamp-2">{v.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
