import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
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
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SheetNode from './SheetNode';
import ConnectionModal from './ConnectionModal';
import type { SheetNodeData } from '@/types/canvas.types';

type SheetNodeType = Node<SheetNodeData, 'sheet'>;

const nodeTypes = {
  sheet: SheetNode,
};

// Palette of visible colors (avoid light/white shades)
const EDGE_COLOR_PALETTE = [
  '#1f6feb', // blue-600
  '#ef4444', // red-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#0ea5e9', // sky-500
  '#7c3aed', // purple-600
];

const pickEdgeColor = (existingEdges: Edge[]) => {
  const used = new Set(existingEdges.map((e) => (e.style as any)?.stroke || (e.data as any)?.color).filter(Boolean));
  const available = EDGE_COLOR_PALETTE.find((c) => !used.has(c));
  if (available) return available;
  // Fallback: pick by round-robin based on number of edges
  return EDGE_COLOR_PALETTE[existingEdges.length % EDGE_COLOR_PALETTE.length];
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
        { id: 'users-po_num', name: 'po_num', type: 'varchar' },
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
        { id: 'posts-amount', name: 'amount', type: 'decimal' },
        { id: 'posts-user_id', name: 'user_id', type: 'uuid' },
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
        { id: 'comments-vendor_name', name: 'vendor_name', type: 'varchar' },
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
    sourceColumnId?: string | null;
    targetColumnId?: string | null;
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
      // Prevent creating connections within the same node (right -> left)
      if (connection.source === connection.target) {
        console.warn('Ignoring self-connection within the same node');
        return;
      }

      // Instead of adding an edge directly, open the confirm modal and pre-select columns when possible.
      const extractCol = (handle?: string) => (handle ? handle.replace(/-(source|target)$/, '') : undefined);
      const sourceColumnId = extractCol(connection.sourceHandle ?? undefined);
      const targetColumnId = extractCol(connection.targetHandle ?? undefined);

      setPendingConnection({
        sourceNodeId: connection.source!,
        targetNodeId: connection.target!,
        sourceColumnId: sourceColumnId ?? null,
        targetColumnId: targetColumnId ?? null,
      });
      setModalOpen(true);
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

  // Listen for mapping-hover (from the left panel) and compute all directly connected columns via edges.
  useEffect(() => {
    const handleMappingHover = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const columnId: string | null = detail?.columnId ?? null;

      if (!columnId) {
        // Clear highlights
        document.dispatchEvent(new CustomEvent('mapping-highlight', { detail: { columnIds: [] } }));
        return;
      }

      const connected = new Set<string>();
      connected.add(columnId);

      edges.forEach((edge) => {
        // If the hovered column is the source, add the target column
        if (edge.sourceHandle === `${columnId}-source` && edge.targetHandle) {
          connected.add(edge.targetHandle.replace(/-target$/, ''));
        }
        // If the hovered column is the target, add the source column
        if (edge.targetHandle === `${columnId}-target` && edge.sourceHandle) {
          connected.add(edge.sourceHandle.replace(/-source$/, ''));
        }
      });

      document.dispatchEvent(new CustomEvent('mapping-highlight', { detail: { columnIds: Array.from(connected) } }));
    };

    document.addEventListener('mapping-hover', handleMappingHover as EventListener);
    return () => document.removeEventListener('mapping-hover', handleMappingHover as EventListener);
  }, [edges]);

  const handleModalConfirm = (sourceColumnId: string, targetColumnId: string) => {
    if (!pendingConnection) return;

    // Disallow creating a connection within the same node (right -> left)
    if (pendingConnection.sourceNodeId === pendingConnection.targetNodeId) {
      console.warn('Cannot create a connection within the same node');
      // Close modal and clear pending connection
      setModalOpen(false);
      setPendingConnection(null);
      return;
    }

    const newEdge: Edge = {
      id: `e-${sourceColumnId}-${targetColumnId}`,
      source: pendingConnection.sourceNodeId,
      sourceHandle: `${sourceColumnId}-source`,
      target: pendingConnection.targetNodeId,
      targetHandle: `${targetColumnId}-target`,
      animated: true,
    };

    // Ensure only one connection exists between the two nodes (unordered pair), and assign a distinct color.
    setEdges((eds) => {
      const filtered = eds.filter((e) => {
        const samePair =
          (e.source === pendingConnection.sourceNodeId && e.target === pendingConnection.targetNodeId) ||
          (e.source === pendingConnection.targetNodeId && e.target === pendingConnection.sourceNodeId);
        return !samePair;
      });

      const color = pickEdgeColor(filtered);
      const coloredEdge = { ...newEdge, style: { stroke: color } } as Edge;

      return [...filtered, coloredEdge];
    });

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
        connectionMode={ConnectionMode.Loose}
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
        initialSourceColumnId={pendingConnection?.sourceColumnId ?? null}
        initialTargetColumnId={pendingConnection?.targetColumnId ?? null}
      />
    </div>
  );
};

export default FlowCanvas;