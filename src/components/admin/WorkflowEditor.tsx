'use client';

import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import NodeConfigPanel from './NodeConfigPanel';

const nodeTypes = {
  // We'll define custom nodes later, using default for now or mapping specific types to default
};

export default function WorkflowEditor({ initialWorkflow }: { initialWorkflow: any }) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialWorkflow.nodes.map((n: any) => ({
      id: n.id,
      type: 'default', // Using default for now, will enhance
      position: { x: n.positionX, y: n.positionY },
      data: { label: n.type, config: n.config, type: n.type }, // Store real type in data
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialWorkflow.edges.map((e: any) => ({
      id: e.id,
      source: e.sourceId,
      target: e.targetId,
      type: 'smoothstep',
      animated: true,
    }))
  );
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleAddNode = (type: string) => {
    const id = crypto.randomUUID();
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 250, y: 100 },
      data: { label: type, type, config: {} },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleUpdateNodeConfig = (nodeId: string, newConfig: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, config: newConfig } };
        }
        return node;
      })
    );
    // Update selected node ref as well to reflect changes immediately in UI if needed
    if (selectedNode?.id === nodeId) {
        setSelectedNode(prev => prev ? ({ ...prev, data: { ...prev.data, config: newConfig } }) : null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: initialWorkflow.name, // TODO: Allow editing name
        description: initialWorkflow.description,
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.data.type,
          positionX: n.position.x,
          positionY: n.position.y,
          config: n.data.config || {},
        })),
        edges: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      };

      const res = await fetch(`/api/workflows/${initialWorkflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      // Optional: Toast notification
      alert('Saved successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full bg-neutral-900">
      {/* Sidebar / Toolkit */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-950 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-4">
            <Link href="/admin" className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h2 className="font-semibold text-white truncate w-32">{initialWorkflow.name}</h2>
                <p className="text-xs text-neutral-500">Editor Mode</p>
            </div>
        </div>

        <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Add Node</p>
            {['WELCOME', 'INSTRUCTION', 'IMAGE_CAPTURE', 'IMAGE_ANALYSIS', 'AI_NODE', 'ISSUE_FINDER', 'LOGICAL_NODE'].map((type) => (
                <button
                    key={type}
                    onClick={() => handleAddNode(type)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-800 text-sm text-neutral-300 transition-all flex items-center gap-2"
                >
                    <Plus className="w-3 h-3" />
                    {type.replace('_', ' ')}
                </button>
            ))}
        </div>
        
        <div className="mt-auto">
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Workflow
            </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          className="bg-neutral-900"
        >
          <Background color="#333" gap={16} variant={BackgroundVariant.Dots} />
          <Controls className="bg-neutral-800 border-neutral-700 fill-white" />
        </ReactFlow>
      </div>

      {/* Config Panel */}
      {selectedNode && (
        <div className="w-80 border-l border-neutral-800 bg-neutral-950 p-4 overflow-y-auto">
            <NodeConfigPanel 
                node={selectedNode} 
                onChange={(config) => handleUpdateNodeConfig(selectedNode.id, config)} 
                onClose={() => setSelectedNode(null)}
            />
        </div>
      )}
    </div>
  );
}
