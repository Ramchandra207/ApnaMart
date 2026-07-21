import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  useEffect(() => { api("/vendors", { auth: false }).then(setVendors); }, []);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="font-display text-3xl mb-6">Our Vendors</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {vendors.map((v) => (
          <Link key={v._id} to={`/vendor/${v.slug}`} className="bg-white border rounded overflow-hidden hover:shadow">
            <div className="h-32 bg-stone-100"><img src={v.banner} alt="" className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="font-semibold">{v.storeName}</div>
              <div className="text-sm text-stone-500 mt-1 line-clamp-2">{v.description}</div>
              <div className="text-xs text-amber-600 mt-2">★ {(v.rating || 0).toFixed(1)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
