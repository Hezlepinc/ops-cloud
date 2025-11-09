export default function StatusLight({ status }: { status: "ok" | "warn" | "error" | "offline" }) {
  const color =
    status === "ok"
      ? "bg-success"
      : status === "warn"
      ? "bg-warning"
      : status === "error"
      ? "bg-danger"
      : "bg-neutral";
  return <span className={`inline-block w-3 h-3 rounded-full ${color}`} />;
}
