import { useMemo, useState } from "react";
import useSWR from "swr";
import ReactFlow, { Background, Controls, ReactFlowProvider, MarkerType, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

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
  const { data } = useSWR("/maps/architecture.json", fetcher);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // Track graph relationships for collapse
  const [childrenMap, setChildrenMap] = useState<Record<string, Set<string>>>({});
  const [nodesState, setNodesState] = useState<Node[] | null>(null);
  const [edgesState, setEdgesState] = useState<Edge[] | null>(null);

  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };
    const nodes: Node[] = (data.nodes || []).map((n: any) => ({
      id: n.id,
      position: n.position,
      data: n.data,
      style: n.style,
      type: n.type || (n.data?.description ? "custom" : undefined)
    }));
    const edges: Edge[] = (data.edges || []).map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      style: e.style,
      markerEnd: e.markerEnd?.typeStr ? { type: MarkerType[e.markerEnd.typeStr] as any, color: e.markerEnd.color } : e.markerEnd
    }));
    return { nodes, edges };
  }, [data]);

  if (!data) return <p>Loading map…</p>;

  const currentNodes = nodesState ?? nodes;
  const currentEdges = edgesState ?? edges;

  function addOrUpdateNodes(newNodes: Node[], newEdges: Edge[], parentId?: string) {
    setNodesState((prev) => {
      const base = prev ?? nodes;
      const ids = new Set(base.map((n) => n.id));
      const merged = [...base];
      newNodes.forEach((n) => { if (!ids.has(n.id)) merged.push(n); });
      return merged;
    });
    setEdgesState((prev) => {
      const base = prev ?? edges;
      const ids = new Set(base.map((e) => e.id));
      const merged = [...base];
      newEdges.forEach((e) => { if (!ids.has(e.id)) merged.push(e); });
      return merged;
    });
    if (parentId && newNodes.length) {
      setChildrenMap((prev) => {
        const next = { ...prev };
        const set = new Set([...(next[parentId] || [])]);
        newNodes.forEach((n) => set.add(n.id));
        next[parentId] = set;
        return next;
      });
    }
  }

  async function expandBrand(brandId: "sparky" | "hezlep") {
    if (expanded[brandId]) return;
    const brandNode = currentNodes.find((n) => n.id === brandId);
    if (!brandNode) return;
    const y = brandNode.position.y;
    const x = brandNode.position.x;
    const stagingId = `${brandId}-staging`;
    const prodId = `${brandId}-prod`;
    const newNodes: Node[] = [
      { id: stagingId, position: { x: x + 160, y: y - 40 }, data: { label: `${brandId === "sparky" ? "Sparky" : "Hezlep"} Staging` }, type: "custom" },
      { id: prodId, position: { x: x + 160, y: y + 40 }, data: { label: `${brandId === "sparky" ? "Sparky" : "Hezlep"} Production` }, type: "custom" }
    ];
    const newEdges: Edge[] = [
      { id: `${brandId}->${stagingId}`, source: brandId, target: stagingId, markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" } as any, label: "env" },
      { id: `${brandId}->${prodId}`, source: brandId, target: prodId, markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" } as any, label: "env" }
    ];
    addOrUpdateNodes(newNodes, newEdges, brandId);
    setExpanded((e) => ({ ...e, [brandId]: true }));
  }

  async function expandEnv(envId: string) {
    if (expanded[envId]) return;
    // Decide endpoint by env id
    const isSparky = envId.startsWith("sparky");
    const isProd = envId.endsWith("prod");
    const base = isSparky ? "sparky-hq" : "hezlep-inc";
    const url = isProd
      ? (isSparky ? "https://sparky-hq.com" : "https://hezlepinc.com")
      : (isSparky ? "https://staging.sparky-hq.com" : "https://staging.hezlepinc.com");
    try {
      const pages = await fetch(`${url}/wp-json/wp/v2/pages?per_page=50`).then((r) => r.json()).catch(() => []);
      const list: any[] = Array.isArray(pages) ? pages.slice(0, 15) : [];
      const envNode = currentNodes.find((n) => n.id === envId);
      if (!envNode) return;
      const baseX = envNode.position.x;
      const baseY = envNode.position.y;
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      // Layout pages in a radial "web" around the env node
      const N = list.length || 1;
      const radius = Math.min(220, 60 + N * 6); // grow radius modestly with count
      list.forEach((p, idx) => {
        const angle = (2 * Math.PI * idx) / N;
        const id = `page:${envId}:${p.id}`;
        const px = baseX + radius * Math.cos(angle);
        const py = baseY + radius * Math.sin(angle);
        newNodes.push({
          id,
          position: { x: px, y: py },
          data: { label: p.title?.rendered || p.slug || `Page ${p.id}` },
          type: "custom"
        });
        newEdges.push({
          id: `${envId}->${id}`,
          source: envId,
          target: id,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" } as any
        });
      });
      addOrUpdateNodes(newNodes, newEdges, envId);
      setExpanded((e) => ({ ...e, [envId]: true }));
    } catch {
      // ignore
    }
  }

  function collapseNode(nodeId: string) {
    const toRemove: Set<string> = new Set();
    function collect(id: string) {
      const kids = childrenMap[id];
      if (kids) {
        kids.forEach((k) => {
          toRemove.add(k);
          collect(k);
        });
      }
    }
    collect(nodeId);
    if (toRemove.size === 0) return;
    setNodesState((prev) => {
      const base = prev ?? nodes;
      return base.filter((n) => !toRemove.has(n.id));
    });
    setEdgesState((prev) => {
      const base = prev ?? edges;
      return base.filter((e) => !(toRemove.has(e.source) || toRemove.has(e.target)));
    });
    setExpanded((e) => {
      const next = { ...e };
      toRemove.forEach((id) => { delete next[id]; });
      return next;
    });
    setChildrenMap((prev) => {
      const next = { ...prev };
      // remove mappings for nodeId and any removed child
      delete next[nodeId];
      toRemove.forEach((id) => delete next[id]);
      return next;
    });
  }

  function onNodeClick(_: any, node: Node) {
    if (node.id === "sparky" || node.id === "hezlep") {
      expandBrand(node.id as any);
    } else if (node.id.endsWith("-staging") || node.id.endsWith("-prod")) {
      expandEnv(node.id);
    }
  }

  function onNodeDoubleClick(_: any, node: Node) {
    if (node.id === "sparky" || node.id === "hezlep") {
      // collapse brand subtree (envs + pages)
      collapseNode(node.id);
      setExpanded((e) => ({ ...e, [node.id]: false }));
    } else if (node.id.endsWith("-staging") || node.id.endsWith("-prod")) {
      // collapse env pages
      collapseNode(node.id);
      setExpanded((e) => ({ ...e, [node.id]: false }));
    }
  }

  function resetGraph() {
    setNodesState(null);
    setEdgesState(null);
    setExpanded({});
    setChildrenMap({});
  }

  return (
    <ReactFlowProvider>
      <div style={{ height: "75vh", border: "1px solid #eee", position: "relative" }}>
        <button onClick={resetGraph} style={{ position: "absolute", zIndex: 10, right: 8, top: 8, padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff" }}>
          Reset
        </button>
        <ReactFlow nodes={currentNodes} edges={currentEdges} nodeTypes={nodeTypes} onNodeClick={onNodeClick} onNodeDoubleClick={onNodeDoubleClick}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}


