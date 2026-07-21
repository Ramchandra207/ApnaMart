import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
export default function Users() {
  const [users, setUsers] = useState([]);
  const load = () => api("/users").then(setUsers);
  useEffect(() => { load(); }, []);
  const toggle = async (u) => { await api(`/users/${u._id}/status`, { method: "PUT", body: { status: u.status === "active" ? "suspended" : "active" } }); load(); };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-3">{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.status}</td>
                <td className="text-right pr-3"><button onClick={() => toggle(u)} className="text-sky-700">{u.status === "active" ? "Suspend" : "Activate"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
