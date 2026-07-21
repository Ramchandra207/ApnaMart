import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api.js";

export default function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  useEffect(() => { api(`/cms/pages/${slug}`, { auth: false }).then(setPage).catch(() => setPage({ title: "Not found", sections: [] })); }, [slug]);
  if (!page) return <div className="p-16 text-center text-stone-500">Loading…</div>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="font-display text-4xl mb-6">{page.title}</h1>
      <div className="space-y-4">
        {page.sections?.map((s, i) => {
          if (s.type === "richtext") return <p key={i} className="text-stone-700">{s.content}</p>;
          if (s.type === "faq-list") return (
            <div key={i} className="space-y-3">
              {s.items?.map((f, j) => (
                <details key={j} className="bg-white border rounded p-3"><summary className="font-medium cursor-pointer">{f.q}</summary><div className="mt-2 text-stone-600 text-sm">{f.a}</div></details>
              ))}
            </div>
          );
          if (s.type === "contact-form") return (
            <form key={i} className="bg-white border rounded p-4 space-y-3">
              <input placeholder="Name" className="w-full border rounded px-3 py-2" />
              <input placeholder="Email" className="w-full border rounded px-3 py-2" />
              <textarea placeholder="Message" className="w-full border rounded px-3 py-2 h-24" />
              <button type="button" className="bg-brand text-white px-4 py-2 rounded">Send Message</button>
            </form>
          );
          return null;
        })}
      </div>
    </div>
  );
}
