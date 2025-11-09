import Header from "./Header";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100">
      <Header />
      <main className="flex-1 px-6 py-4 overflow-hidden flex flex-col items-center justify-start">
        <div className="w-full max-w-[1600px] h-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
}


