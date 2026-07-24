import { Routes, Route, Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Enquiries from "./pages/Enquiries.jsx";
import Users from "./pages/Users.jsx";
import Vendors from "./pages/Vendors.jsx";
import Categories from "./pages/Categories.jsx";
import Cms from "./pages/Cms.jsx";
import Settings from "./pages/Settings.jsx";
import Coupons from "./pages/Coupons.jsx";
import VendorStore from "./pages/VendorStore.jsx";

const ADMIN_NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/enquiries", label: "Enquiries" },
  { to: "/vendors", label: "Vendors" },
  { to: "/users", label: "Users" },
  { to: "/categories", label: "Categories" },
  { to: "/coupons", label: "Coupons" },
  { to: "/cms", label: "CMS Pages" },
  { to: "/settings", label: "Settings" },
];

const VENDOR_NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "My Products" },
  { to: "/orders", label: "My Orders" },
  { to: "/enquiries", label: "Enquiries" },
  { to: "/store", label: "My Store" },
];

function Shell({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const items = user.role === "admin" ? ADMIN_NAV : VENDOR_NAV;
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-slate-900 text-slate-200 p-4">
        <div className="font-bold text-lg mb-6">Apna Mart {user.role === "admin" ? "Admin" : "Vendor"}</div>
        <nav className="space-y-1 text-sm">
          {items.map((n) => (
            <Link key={n.to} to={n.to} className={`block px-3 py-2 rounded ${loc.pathname === n.to ? "bg-slate-700 text-white" : "hover:bg-slate-800"}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-slate-800 text-sm">
          <div className="text-slate-400">{user.name}</div>
          <button onClick={() => { logout(); nav("/login"); }} className="mt-2 text-slate-300 hover:text-white">Logout</button>
        </div>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-16 text-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin" && user.role !== "vendor") return <div className="p-16 text-center">This dashboard is for admins and vendors only.</div>;
  return <Shell>{children}</Shell>;
}

function AdminOnly({ children }) {
  const { user } = useAuth();
  if (user.role !== "admin") return <div className="p-6">Not authorized.</div>;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/products" element={<Protected><Products /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/enquiries" element={<Protected><Enquiries /></Protected>} />
      <Route path="/vendors" element={<Protected><AdminOnly><Vendors /></AdminOnly></Protected>} />
      <Route path="/users" element={<Protected><AdminOnly><Users /></AdminOnly></Protected>} />
      <Route path="/categories" element={<Protected><AdminOnly><Categories /></AdminOnly></Protected>} />
      <Route path="/coupons" element={<Protected><AdminOnly><Coupons /></AdminOnly></Protected>} />
      <Route path="/cms" element={<Protected><AdminOnly><Cms /></AdminOnly></Protected>} />
      <Route path="/settings" element={<Protected><AdminOnly><Settings /></AdminOnly></Protected>} />
      <Route path="/store" element={<Protected><VendorStore /></Protected>} />
    </Routes>
  );
}
