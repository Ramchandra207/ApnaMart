import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try { await register(form); nav("/"); } catch (err) { setError(err.message); }
  };
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="font-display text-3xl mb-6">Create your account</h2>
      <form onSubmit={submit} className="space-y-3 bg-white border rounded p-6">
        {["name", "email", "phone", "password"].map((k) => (
          <input key={k} type={k === "password" ? "password" : "text"} placeholder={k} className="w-full border rounded px-3 py-2" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded">Register</button>
        <div className="text-sm text-stone-500 text-center">Have an account? <Link to="/login" className="text-brand-dark">Login</Link></div>
      </form>
    </div>
  );
}
