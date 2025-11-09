import Header from "./Header";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <Header />
      <main className="flex-1 px-4 md:px-6 py-4 overflow-hidden flex items-stretch justify-stretch">
        <div className="w-full max-w-[1600px] mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}


