import AppShell from "@/components/layout/AppShell";
import ConnectionsView from "@/components/ConnectionsView";

export default function AIConnections() {
	return (
		<AppShell>
			<div className="max-w-6xl mx-auto">
				<div className="mb-4">
					<h1 className="text-xl font-semibold">AI Connections</h1>
					<p className="text-sm text-zinc-500">API health, integrations, and daily AI suggestions.</p>
				</div>
				<div className="app-card p-4">
					<ConnectionsView />
				</div>
			</div>
		</AppShell>
	);
}


