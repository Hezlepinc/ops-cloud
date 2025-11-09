import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}


