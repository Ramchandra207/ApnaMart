import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [vendorOrders, setVendorOrders] = useState([]);

  useEffect(() => {
    if (user.role === "admin") {
      api("/reports/summary").then(setData);
    } else {
      api("/orders/vendor/mine").then(setVendorOrders);
    }
  }, [user]);

  if (user.role === "vendor") {
    const revenue = vendorOrders.reduce((s, o) => s + o.total, 0);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <Card label="Total Orders" value={vendorOrders.length} />
          <Card label="Revenue (gross)" value={money(revenue)} />
          <Card label="Pending" value={vendorOrders.filter(o => o.orderStatus === "pending").length} />
        </div>
        <div className="mt-6 bg-white rounded border p-4">
          <h3 className="font-semibold mb-3">Latest Orders</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500"><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {vendorOrders.slice(0, 10).map(o => (
                <tr key={o._id} className="border-t"><td className="py-2 font-mono">{o.orderNo}</td><td>{o.userId?.name}</td><td>{o.orderStatus}</td><td>{money(o.total)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data) return <div>Loading…</div>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <Card label="Revenue" value={money(data.totalRevenue)} />
        <Card label="Orders" value={data.totalOrders} />
        <Card label="Customers" value={data.totalCustomers} />
        <Card label="Vendors" value={data.totalVendors} />
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded border p-4">
          <h3 className="font-semibold mb-3">Latest Orders</h3>
          <table className="w-full text-sm">
            <tbody>{data.latestOrders?.map(o => <tr key={o._id} className="border-t"><td className="py-2 font-mono">{o.orderNo}</td><td>{o.userId?.name}</td><td>{o.orderStatus}</td><td className="text-right">{money(o.total)}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="bg-white rounded border p-4">
          <h3 className="font-semibold mb-3">Low Stock ({data.lowStock?.length || 0})</h3>
          <ul className="text-sm space-y-1">
            {data.lowStock?.map(p => <li key={p._id} className="flex justify-between"><span>{p.title}</span><span className="text-red-600">{p.stock} left</span></li>)}
          </ul>
        </div>
      </div>
      <div className="mt-6 bg-white rounded border p-4">
        <div className="flex justify-between"><h3 className="font-semibold">Pending Enquiries</h3><span className="text-slate-500 text-sm">{data.pendingEnquiries}</span></div>
        <a href={`${import.meta.env.VITE_API_URL}/reports/export/orders.csv`} className="mt-3 inline-block text-sm text-sky-700">Export orders CSV →</a>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return <div className="bg-white rounded border p-4"><div className="text-sm text-slate-500">{label}</div><div className="text-2xl font-bold mt-1">{value}</div></div>;
}
