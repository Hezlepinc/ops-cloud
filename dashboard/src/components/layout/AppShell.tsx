import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <Topbar />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}


