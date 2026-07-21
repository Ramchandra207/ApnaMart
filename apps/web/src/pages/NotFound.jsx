import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="p-16 text-center">
      <h1 className="font-display text-6xl">404</h1>
      <p className="text-stone-500 mt-2">Page not found.</p>
      <Link to="/" className="inline-block mt-4 text-brand-dark">Go home →</Link>
    </div>
  );
}
