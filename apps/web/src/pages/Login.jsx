import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("customer1@jietmart.com");
  const [password, setPassword] = useState("Customer@123");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try { await login(email, password); nav("/"); } catch (err) { setError(err.message); }
  };
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="font-display text-3xl mb-6">Welcome back</h2>
      <form onSubmit={submit} className="space-y-3 bg-white border rounded p-6">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded">Login</button>
        <div className="text-sm text-stone-500 text-center">New here? <Link to="/register" className="text-brand-dark">Create account</Link></div>
      </form>
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-stone-700">
        <div className="font-semibold mb-1">Demo credentials</div>
        Customer: customer1@jietmart.com / Customer@123<br />
        Vendor: vendor1@jietmart.com / Vendor@123<br />
        Admin (use admin app): admin@jietmart.com / Admin@123
      </div>
    </div>
  );
}
