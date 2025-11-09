import AppShell from "@/components/layout/AppShell";
import Link from "next/link";

const DEMO = [
  {
    name: "Acme Electric",
    slug: "acme-electric",
    sector: "Electrical",
    status: "Prospect",
    staging: "#",
    production: "#"
  },
  {
    name: "Bright Plumbing",
    slug: "bright-plumbing",
    sector: "Plumbing",
    status: "Demo",
    staging: "#",
    production: "#"
  },
  {
    name: "Hezlep Inc",
    slug: "hezlep-inc",
    sector: "Corporate",
    status: "Live",
    staging: "https://staging.hezlepinc.com",
    production: "https://hezlepinc.com"
  }
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
}

export default function Clients() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Clients</h1>
          <p className="text-sm text-zinc-500">Stock examples for demo purposes. Replace with real customers later.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO.map(c => (
            <div key={c.slug} className="app-card p-4">
              <div className="flex items-center gap-3">
                <Avatar name={c.name} />
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-zinc-500">{c.sector} • <span className="uppercase">{c.status}</span></div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link href={c.staging} className="app-btn-ghost" target="_blank">Staging</Link>
                <Link href={c.production} className="app-btn" target="_blank">Production</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}


