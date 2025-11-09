import { useEffect } from "react";
import useSWR from "swr";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function MapViewer() {
  const { data } = useSWR("/maps/architecture.json", fetcher);

  useEffect(() => {
    // ensure CSS is present for reactflow in export
  }, []);

  if (!data) return <p>Loading map…</p>;
  const { nodes = [], edges = [] } = data;

  return (
    <div style={{ height: "75vh", border: "1px solid #eee" }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}


