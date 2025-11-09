import { useMemo } from "react";
import useSWR from "swr";
import ReactFlow, { Background, Controls, ReactFlowProvider, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import type { Node, Edge } from "reactflow";

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

  return (
    <ReactFlowProvider>
      <div style={{ height: "75vh", border: "1px solid #eee" }}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}


