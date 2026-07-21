import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { useCart } from "./context/CartContext.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import VendorStore from "./pages/VendorStore.jsx";
import Vendors from "./pages/Vendors.jsx";
import CmsPage from "./pages/CmsPage.jsx";
import NotFound from "./pages/NotFound.jsx";

function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link to="/" className="font-display text-2xl text-brand-dark">JIET Fashion Mart</Link>
        <nav className="hidden md:flex gap-5 text-sm text-stone-700">
          <Link to="/products">Shop</Link>
          <Link to="/vendors">Vendors</Link>
          <Link to="/cms/about">About</Link>
          <Link to="/cms/contact">Contact</Link>
        </nav>
        <div className="flex-1" />
        <Link to="/cart" className="relative text-sm">
          Cart
          {cart?.items?.length ? <span className="absolute -top-2 -right-3 bg-brand text-white text-xs rounded-full w-5 h-5 grid place-items-center">{cart.items.length}</span> : null}
        </Link>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <Link to="/account">{user.name.split(" ")[0]}</Link>
            <button onClick={() => { logout(); nav("/"); }} className="text-stone-500 hover:text-stone-900">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="text-sm">Login</Link>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display text-white text-xl">JIET Fashion Mart</div>
          <p className="mt-2 text-stone-400">A multi-vendor fashion marketplace by JIET MERN interns.</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-2">Shop</div>
          <ul className="space-y-1"><li><Link to="/products">All Products</Link></li><li><Link to="/vendors">Vendors</Link></li></ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-2">Company</div>
          <ul className="space-y-1"><li><Link to="/cms/about">About</Link></li><li><Link to="/cms/contact">Contact</Link></li><li><Link to="/cms/faq">FAQ</Link></li></ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-2">Legal</div>
          <ul className="space-y-1"><li><Link to="/cms/privacy">Privacy Policy</Link></li><li><Link to="/cms/terms">Terms</Link></li></ul>
        </div>
      </div>
      <div className="text-center py-4 text-stone-500 text-xs border-t border-stone-800">© {new Date().getFullYear()} JIET Fashion Mart</div>
    </footer>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-stone-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendor/:slug" element={<VendorStore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
          <Route path="/account" element={<Protected><Account /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cms/:slug" element={<CmsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
