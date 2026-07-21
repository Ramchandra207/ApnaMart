import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@jietmart.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try { const u = await login(email, password); if (u.role !== "admin" && u.role !== "vendor") throw new Error("Not authorized"); nav("/"); } catch (err) { setError(err.message); }
  };
  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-3">
        <h1 className="font-bold text-2xl">Dashboard Login</h1>
        <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-slate-900 text-white py-2 rounded">Login</button>
        <div className="text-xs text-slate-500 border-t pt-3">
          Admin: admin@jietmart.com / Admin@123<br />
          Vendor: vendor1@jietmart.com / Vendor@123
        </div>
      </form>
    </div>
  );
}
