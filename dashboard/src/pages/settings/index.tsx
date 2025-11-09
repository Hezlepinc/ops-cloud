import AppShell from "@/components/layout/AppShell";
export default function Settings() {
  return (
    <AppShell>
      <div className="app-card p-6">
        <h1 className="text-xl font-semibold mb-2">Settings</h1>
        <p className="text-sm text-zinc-500">Org, API keys, and user preferences.</p>
      </div>
    </AppShell>
  );
}


