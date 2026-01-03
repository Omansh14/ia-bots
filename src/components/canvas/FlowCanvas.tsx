import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  // MiniMap,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SheetNode from './SheetNode';
import ConnectionModal from './ConnectionModal';
import type { SheetNodeData } from '@/types/canvas.types';

type SheetNodeType = Node<SheetNodeData, 'sheet'>;

const nodeTypes = {
  sheet: SheetNode,
};

const initialNodes: SheetNodeType[] = [
  {
    id: 'users',
    type: 'sheet',
    position: { x: 100, y: 100 },
    data: {
      label: 'Users',
      columns: [
        { id: 'users-id', name: 'id', type: 'uuid' },
        { id: 'users-email', name: 'email', type: 'varchar' },
        { id: 'users-name', name: 'name', type: 'varchar' },
        { id: 'users-created', name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'posts',
    type: 'sheet',
    position: { x: 450, y: 80 },
    data: {
      label: 'Posts',
      columns: [
        { id: 'posts-id', name: 'id', type: 'uuid' },
        { id: 'posts-title', name: 'title', type: 'varchar' },
        { id: 'posts-content', name: 'content', type: 'text' },
        { id: 'posts-author', name: 'author_id', type: 'uuid' },
        { id: 'posts-created', name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'comments',
    type: 'sheet',
    position: { x: 800, y: 150 },
    data: {
      label: 'Comments',
      columns: [
        { id: 'comments-id', name: 'id', type: 'uuid' },
        { id: 'comments-text', name: 'text', type: 'text' },
        { id: 'comments-post', name: 'post_id', type: 'uuid' },
        { id: 'comments-user', name: 'user_id', type: 'uuid' },
      ],
    },
  },
];

const initialEdges: Edge[] = [];

const FlowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<{
    sourceNodeId: string;
    targetNodeId: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as SheetNodeType[]),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    []
  );

  // Handle column drop events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleColumnDrop = (e: CustomEvent) => {
      const { sourceNodeId, targetNodeId } = e.detail;
      setPendingConnection({ sourceNodeId, targetNodeId });
      setModalOpen(true);
    };

    container.addEventListener('column-drop', handleColumnDrop as EventListener);
    return () => {
      container.removeEventListener('column-drop', handleColumnDrop as EventListener);
    };
  }, []);

  const handleModalConfirm = (sourceColumnId: string, targetColumnId: string) => {
    if (!pendingConnection) return;

    const newEdge: Edge = {
      id: `e-${sourceColumnId}-${targetColumnId}`,
      source: pendingConnection.sourceNodeId,
      sourceHandle: `${sourceColumnId}-source`,
      target: pendingConnection.targetNodeId,
      targetHandle: `${targetColumnId}-target`,
      animated: true,
    };

    setEdges((eds) => [...eds, newEdge]);
    setPendingConnection(null);
  };

  const sourceNode = pendingConnection
    ? nodes.find((n) => n.id === pendingConnection.sourceNodeId)?.data
    : null;
  const targetNode = pendingConnection
    ? nodes.find((n) => n.id === pendingConnection.targetNodeId)?.data
    : null;

  return (
    <div ref={containerRef} className="w-full h-screen bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(220 15% 20%)"
        />
        <Controls className="!bg-card !border-border !rounded-lg !shadow-xl" />
        {/* <MiniMap
          className="!bg-card !border-border !rounded-lg !shadow-md"
          nodeColor="#dae6fa"
          maskColor="oklch(0.556 0 0)"
        /> */}
      </ReactFlow>

      <ConnectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPendingConnection(null);
        }}
        onConfirm={handleModalConfirm}
        sourceNode={sourceNode ?? null}
        targetNode={targetNode ?? null}
      />
    </div>
  );
};

export default FlowCanvas;
