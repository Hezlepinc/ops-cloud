import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import HealthCard from "@/components/cards/HealthCard";
import SitesCard from "@/components/cards/SitesCard";
import TicketsCard from "@/components/cards/TicketsCard";
import AISuggestionCard from "@/components/cards/AISuggestionCard";
import AIStatusCard from "@/components/cards/AIStatusCard";

export default function HomePage() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr h-full">
        <HealthCard />
        <SitesCard />
        <TicketsCard />
        <AISuggestionCard />
        <AIStatusCard />
      </div>
    </AppShell>
  );
}


