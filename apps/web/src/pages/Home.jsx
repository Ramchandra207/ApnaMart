import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { imageUrl } from "../lib/images.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api("/categories", { auth: false }),
      api("/products?featured=true&limit=8", { auth: false }),
      api("/vendors", { auth: false }),
      api("/settings", { auth: false }),
    ])
      .then(([c, p, v, s]) => {
        setCategories(c);
        setTrending(p.items);
        setVendors(v);
        setSettings(s);
      })
      .catch((err) => setError(err.message || "Could not load the homepage."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center text-stone-500">Loading…</div>;

  if (error) return <div className="p-16 text-center text-red-600">{error}</div>;

  const banner = settings.homepageBanners?.[0];

  return (
    <div>
      {banner && (
        <section className="relative h-[460px] overflow-hidden bg-gradient-to-br from-brand-dark via-amber-900 to-orange-500">
          <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-orange-200/20 blur-3xl" />
          <img src={imageUrl(banner.image, banner.title)} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-lg">
              <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Fashion marketplace</span>
              <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">{banner.title}</h1>
              <p className="mt-4 text-lg text-white/85">{banner.subtitle}</p>
              <Link to={banner.cta || "/products"} className="inline-block mt-7 rounded-full bg-white px-7 py-3 font-semibold text-stone-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-50">Shop now <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-display text-3xl mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link key={c._id} to={`/products?category=${c._id}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-orange-300 to-brand transition hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center font-display text-5xl text-white/35">{c.name.charAt(0)}</div>
              <img src={imageUrl(c.image, c.name)} alt={c.name} className="relative z-10 h-full w-full object-cover transition duration-500 group-hover:scale-110" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-sm font-semibold text-white">{c.name}</span>
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
            <Link key={v._id} to={`/vendor/${v.slug}`} className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-amber-200 to-orange-500">
                <span className="absolute inset-0 grid place-items-center font-display text-2xl text-white">{v.storeName.charAt(0)}</span>
                <img src={imageUrl(v.logo, v.storeName)} alt="" className="relative h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              </div>
              <div>
                <div className="font-semibold group-hover:text-brand-dark">{v.storeName}</div>
                <div className="text-sm text-stone-500 line-clamp-2">{v.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
