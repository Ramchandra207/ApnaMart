import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="font-display text-3xl mb-6">My Account</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-2">Profile</h3>
          <div className="text-sm text-stone-700">{user.name}<br />{user.email}<br />{user.phone}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1">
            <li><Link to="/orders" className="text-brand-dark">My Orders</Link></li>
            <li><Link to="/products" className="text-brand-dark">Continue Shopping</Link></li>
          </ul>
        </div>
        <div className="bg-white border rounded p-4 md:col-span-2">
          <h3 className="font-semibold mb-2">Saved Addresses</h3>
          {user.addresses?.length ? user.addresses.map((a, i) => (
            <div key={i} className="text-sm border-b py-2 last:border-0">
              <div className="font-medium">{a.label} — {a.fullName}</div>
              <div className="text-stone-600">{a.line1}, {a.city}, {a.state} {a.pincode}</div>
            </div>
          )) : <div className="text-sm text-stone-500">No addresses saved yet.</div>}
        </div>
      </div>
    </div>
  );
}
