import { useMemo, useState, useCallback } from "react";
import useSWR from "swr";
import ReactFlow, { Background, Controls, ReactFlowProvider, MarkerType, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

function CustomNode({ data }: any) {
  return (
    <div style={{ padding: 8, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.1)", background: "#fff", border: "1px solid #e5e7eb" }}>
      <div style={{ fontWeight: 600 }}>{data.label}</div>
      {data.description ? <div style={{ fontSize: 12, color: "#6b7280" }}>{data.description}</div> : null}
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function MapViewer() {
  // Static base map (optional, used for colors/titles if present)
  const { data: base } = useSWR("/maps/architecture.json", fetcher);
  // Live environment data and pages
  const { data: envs } = useSWR("/maps/environments.json", fetcher);
  const { data: sites } = useSWR("/maps/sites.json", fetcher);

  // Expansion state
  const [cloudwaysExpanded, setCloudwaysExpanded] = useState<boolean>(true);
  const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({});

  const toggleApp = useCallback((appId: string) => {
    setExpandedApps((prev) => ({ ...prev, [appId]: !prev[appId] }));
  }, []);
  const resetLayout = useCallback(() => {
    setCloudwaysExpanded(true);
    setExpandedApps({});
  }, []);
  const expandAllApps = useCallback(() => {
    const next: Record<string, boolean> = {};
    if (envs && typeof envs === "object") {
      Object.entries<any>(envs).forEach(([brand, brandEnvs]) => {
        Object.keys(brandEnvs || {}).forEach((envName) => {
          next[`app:${brand}:${envName}`] = true;
        });
      });
    }
    setCloudwaysExpanded(true);
    setExpandedApps(next);
  }, [envs]);

  // Build nodes/edges left-to-right using dagre for non-overlapping layout
  const { nodes, edges } = useMemo(() => {
    // Base high-level flow: Ops Cloud → Render → Cloudways → Orchestrator → GitHub
    const builtNodes: Node[] = [];
    const builtEdges: Edge[] = [];

    const styleBase = { border: "1px solid #e5e7eb", background: "#fff" };
    const addNode = (id: string, label: string, group?: string, type?: string) => {
      const baseNode = (base?.nodes || []).find((n: any) => n.id === id);
      builtNodes.push({
        id,
        type: type || (baseNode?.data?.description ? "custom" : undefined),
        data: { label, description: baseNode?.data?.description },
        position: { x: 0, y: 0 },
        style: { ...styleBase, ...(baseNode?.style || {}) },
        parentNode: group,
      });
    };
    const addEdge = (source: string, target: string, label?: string) => {
      builtEdges.push({
        id: `${source}→${target}`,
        source,
        target,
        label,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#374151" } as any,
      });
    };

    addNode("ops-cloud", "Ops Cloud");
    addNode("render", "Render");
    addNode("cloudways", "Cloudways");
    addNode("orchestrator", "Orchestrator");
    addNode("github", "GitHub");

    addEdge("ops-cloud", "render");
    addEdge("render", "cloudways");
    addEdge("cloudways", "orchestrator");
    addEdge("orchestrator", "github");

    // Expand Cloudways → Server → Apps
    if (cloudwaysExpanded) {
      addNode("cw-server", "Cloudways Server");
      addEdge("cloudways", "cw-server");

      // Synthesize app nodes from environments (brand + env)
      const appNodes: string[] = [];
      if (envs && typeof envs === "object") {
        Object.entries<any>(envs).forEach(([brand, brandEnvs]) => {
          Object.keys(brandEnvs || {}).forEach((envName) => {
            const appId = `app:${brand}:${envName}`;
            const label = `${brand} ${envName}`;
            addNode(appId, label, undefined);
            addEdge("cw-server", appId);
            appNodes.push(appId);
          });
        });
      }

      // Apps → Pages (expand per app toggle)
      appNodes.forEach((appId) => {
        if (!expandedApps[appId]) return;
        // Derive brand from id
        const parts = appId.split(":");
        const brandSlug = parts[1] || "";
        // Try to pick a display key for sites.json (Sparky-HQ uses capitalized key)
        const brandDisplay =
          Object.keys(sites || {}).find((k) => k.toLowerCase().includes(brandSlug.replace("-", ""))) ||
          Object.keys(sites || {})[0];
        const pages = (sites && brandDisplay && sites[brandDisplay]) ? Object.entries<string>(sites[brandDisplay]) : [];
        // Add at most first 12 pages for readability
        pages.slice(0, 12).forEach(([slug, link], idx) => {
          const pageId = `${appId}:page:${slug}`;
          addNode(pageId, slug);
          addEdge(appId, pageId);
        });
      });
    }

    // Auto layout (left-to-right) with dagre
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 80, marginx: 50, marginy: 50 });
    g.setDefaultEdgeLabel(() => ({}));

    const NODE_W = 180;
    const NODE_H = 60;
    builtNodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
    builtEdges.forEach((e) => g.setEdge(e.source, e.target));
    dagre.layout(g);
    const laidOutNodes = builtNodes.map((n) => {
      const p = g.node(n.id);
      return { ...n, position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 } };
    });

    return { nodes: laidOutNodes, edges: builtEdges };
  }, [base, envs, sites, cloudwaysExpanded, expandedApps]);

  const onNodeDoubleClick = useCallback((_e: any, node: Node) => {
    if (node.id.startsWith("app:")) {
      toggleApp(node.id);
    } else if (node.id === "cloudways") {
      setCloudwaysExpanded((v) => !v);
    }
  }, [toggleApp]);

  return (
    <ReactFlowProvider>
      <div style={{ height: "calc(100vh - 120px)", border: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 8, padding: 8 }}>
          <button onClick={resetLayout} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb" }}>
            Reset Layout
          </button>
          <button onClick={expandAllApps} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb" }}>
            Expand All Apps
          </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}


