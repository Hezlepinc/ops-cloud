export default function TicketsCard() {
  const tickets = [
    { id: 101, subject: "Staging site downtime", status: "open" },
    { id: 102, subject: "SSL renew request", status: "closed" }
  ];
  const openCount = tickets.filter((t) => t.status === "open").length;
  return (
    <div className="app-card p-4">
      <h3 className="font-semibold text-lg mb-1">Customer Requests</h3>
      <p className="text-sm mb-2">{openCount} open requests</p>
      <ul className="text-xs text-zinc-500 space-y-1">
        {tickets.slice(0, 2).map((t) => (
          <li key={t.id}>• {t.subject}</li>
        ))}
      </ul>
    </div>
  );
}
