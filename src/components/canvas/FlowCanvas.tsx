import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
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

export type SheetNodeType = Node<SheetNodeData, 'sheet'>;

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
  const used = new Set(
    existingEdges.map((e) => (e.style as any)?.stroke || (e.data as any)?.color).filter(Boolean),
  );
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
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as SheetNodeType[]),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  /**
   * Determines the optimal handle pair based on node positions
   * Returns handles that create the shortest path
   */
  const getOptimalHandles = (
    sourceNodeId: string,
    targetNodeId: string,
    sourceHandle?: string,
    targetHandle?: string,
  ): { sourceHandle: string; targetHandle: string } => {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    const targetNode = nodes.find((n) => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      // Fallback to provided handles or defaults
      return {
        sourceHandle: sourceHandle || 'right',
        targetHandle: targetHandle || 'left',
      };
    }

    // Determine which side to use based on relative positions
    const sourceIsLeft = sourceNode.position.x < targetNode.position.x;

    if (sourceHandle && targetHandle) {
      // Handles were specified (from drag/drop) - extract column IDs and sides
      const sourceColumnId = sourceHandle.replace(/-(left|right)$/, '');
      const targetColumnId = targetHandle.replace(/-(left|right)$/, '');

      // Choose the shortest path based on node positions
      if (sourceIsLeft) {
        // Source is on the left - use right handle of source, left handle of target
        return {
          sourceHandle: `${sourceColumnId}-right`,
          targetHandle: `${targetColumnId}-left`,
        };
      } else {
        // Source is on the right - use left handle of source, right handle of target
        return {
          sourceHandle: `${sourceColumnId}-left`,
          targetHandle: `${targetColumnId}-right`,
        };
      }
    }

    // No handles specified - shouldn't happen, but fallback
    return {
      sourceHandle: sourceIsLeft ? 'right' : 'left',
      targetHandle: sourceIsLeft ? 'left' : 'right',
    };
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      // Prevent creating connections within the same node
      if (connection.source === connection.target) {
        console.warn('Ignoring self-connection within the same node');
        return;
      }

      const extractCol = (handle?: string) =>
        handle ? handle.replace(/-(left|right)$/, '') : undefined;
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
    [nodes],
  );

  // Handle column drop events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleColumnDrop = (e: CustomEvent) => {
      const { sourceNodeId, targetNodeId, sourceColumnId, targetColumnId } = e.detail;
      setPendingConnection({
        sourceNodeId,
        targetNodeId,
        sourceColumnId,
        targetColumnId,
      });
      setModalOpen(true);
    };

    container.addEventListener('column-drop', handleColumnDrop as EventListener);
    return () => {
      container.removeEventListener('column-drop', handleColumnDrop as EventListener);
    };
  }, []);

  // Listen for mapping-hover and compute all directly connected columns via edges
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
        // Extract column IDs from handles (remove -left or -right suffix)
        const sourceColumnId = edge.sourceHandle?.replace(/-(left|right)$/, '');
        const targetColumnId = edge.targetHandle?.replace(/-(left|right)$/, '');

        // If the hovered column is the source, add the target column
        if (sourceColumnId === columnId && targetColumnId) {
          connected.add(targetColumnId);
        }
        // If the hovered column is the target, add the source column
        if (targetColumnId === columnId && sourceColumnId) {
          connected.add(sourceColumnId);
        }
      });

      document.dispatchEvent(
        new CustomEvent('mapping-highlight', { detail: { columnIds: Array.from(connected) } }),
      );
    };

    document.addEventListener('mapping-hover', handleMappingHover as EventListener);
    return () => document.removeEventListener('mapping-hover', handleMappingHover as EventListener);
  }, [edges]);

  const handleModalConfirm = (sourceColumnId: string, targetColumnId: string) => {
    if (!pendingConnection) return;

    // Disallow creating a connection within the same node
    if (pendingConnection.sourceNodeId === pendingConnection.targetNodeId) {
      console.warn('Cannot create a connection within the same node');
      setModalOpen(false);
      setPendingConnection(null);
      return;
    }

    // Get optimal handles based on node positions
    const { sourceHandle, targetHandle } = getOptimalHandles(
      pendingConnection.sourceNodeId,
      pendingConnection.targetNodeId,
      `${sourceColumnId}-right`, // temporary, will be optimized
      `${targetColumnId}-left`, // temporary, will be optimized
    );

    const newEdge: Edge = {
      id: `e-${pendingConnection.sourceNodeId}-${sourceColumnId}-${pendingConnection.targetNodeId}-${targetColumnId}`,
      source: pendingConnection.sourceNodeId,
      sourceHandle,
      target: pendingConnection.targetNodeId,
      targetHandle,
      animated: true,
    };

    setEdges((eds) => {
      const color = pickEdgeColor(eds);
      const coloredEdge = { ...newEdge, style: { stroke: color } } as Edge;
      return [...eds, coloredEdge];
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
    <div ref={containerRef} className="w-full h-screen bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        connectionLineComponent={() => null}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(220 15% 20%)" />
        <span className="absolute right-20 top-50">
          <Controls className="!bg-card !border-border !rounded-lg !shadow-xl" />
        </span>
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