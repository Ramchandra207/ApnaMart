import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import { imageUrl } from "../lib/images.js";
import ProductCard from "../components/ProductCard.jsx";

export default function VendorStore() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api(`/vendors/${slug}`, { auth: false }).then((v) => {
      setVendor(v);
      api(`/products?vendor=${v._id}&limit=50`, { auth: false }).then((d) => setProducts(d.items));
    });
  }, [slug]);
  if (!vendor) return <div className="p-16 text-center text-stone-500">Loading…</div>;
  return (
    <div>
      <div className="h-56 bg-stone-100 relative">
        <img src={imageUrl(vendor.banner, vendor.storeName)} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative">
        <div className="bg-white p-4 rounded shadow-sm flex items-center gap-4">
          <img src={imageUrl(vendor.logo, vendor.storeName)} alt="" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h1 className="font-display text-2xl">{vendor.storeName}</h1>
            <div className="text-sm text-stone-500">{vendor.description}</div>
          </div>
        </div>
        <h2 className="mt-8 font-display text-2xl">Products</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p._id} p={p} />)}
        </div>
      </div>
    </div>
  );
}
