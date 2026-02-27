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
import AppendConfirmModal from './AppendConfirmModal';
import type { SheetNodeData } from '@/types/canvas.types';
import toast from 'react-hot-toast';

export type SheetNodeType = Node<SheetNodeData, 'sheet'>;

const nodeTypes = { sheet: SheetNode };

const EDGE_COLOR_PALETTE = [
  '#1f6feb',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#0ea5e9',
  '#7c3aed',
];

const pickEdgeColor = (existingEdges: Edge[]) => {
  const used = new Set(
    existingEdges.map((e) => (e.style as any)?.stroke || (e.data as any)?.color).filter(Boolean),
  );
  const available = EDGE_COLOR_PALETTE.find((c) => !used.has(c));
  return available ?? EDGE_COLOR_PALETTE[existingEdges.length % EDGE_COLOR_PALETTE.length];
};

const isAppendHandle = (handle?: string | null) =>
  handle?.endsWith('-top') || handle?.endsWith('-bottom');

const hasColumnEdge = (edges: Edge[], nodeIdA: string, nodeIdB: string) =>
  edges.some(
    (e) =>
      e.data?.connectionType !== 'append' &&
      ((e.source === nodeIdA && e.target === nodeIdB) ||
        (e.source === nodeIdB && e.target === nodeIdA)),
  );

const hasAppendEdge = (edges: Edge[], nodeIdA: string, nodeIdB: string) =>
  edges.some(
    (e) =>
      e.data?.connectionType === 'append' &&
      ((e.source === nodeIdA && e.target === nodeIdB) ||
        (e.source === nodeIdB && e.target === nodeIdA)),
  );

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
  const containerRef = useRef<HTMLDivElement>(null);
  // Column-mapping modal state
  const [modalOpen, setModalOpen] = useState(false);
  // Append-confirm modal state
  const [appendModalOpen, setAppendModalOpen] = useState(false);

  const [pendingConnection, setPendingConnection] = useState<{
    sourceNodeId: string;
    targetNodeId: string;
    sourceColumnId?: string | null;
    targetColumnId?: string | null;
  } | null>(null);

  const [pendingAppend, setPendingAppend] = useState<{
    sourceNodeId: string;
    sourceNodeLabel: string;
    targetNodeId: string;
    targetNodeLabel: string;
  } | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as SheetNodeType[]),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // ── optimal handle resolution ─────────────────────────────────

  const getOptimalHandles = (
    sourceNodeId: string,
    targetNodeId: string,
    sourceHandle?: string,
    targetHandle?: string,
  ): { sourceHandle: string; targetHandle: string } => {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    const targetNode = nodes.find((n) => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      return { sourceHandle: sourceHandle || 'right', targetHandle: targetHandle || 'left' };
    }

    const sourceIsLeft = sourceNode.position.x < targetNode.position.x;

    if (sourceHandle && targetHandle) {
      const sourceColumnId = sourceHandle.replace(/-(left|right)$/, '');
      const targetColumnId = targetHandle.replace(/-(left|right)$/, '');
      return sourceIsLeft
        ? { sourceHandle: `${sourceColumnId}-right`, targetHandle: `${targetColumnId}-left` }
        : { sourceHandle: `${sourceColumnId}-left`, targetHandle: `${targetColumnId}-right` };
    }

    return {
      sourceHandle: sourceIsLeft ? 'right' : 'left',
      targetHandle: sourceIsLeft ? 'left' : 'right',
    };
  };

  // ── append edge builder ────────────────────────────────────────────────────
  const buildAppendEdge = (sourceNodeId: string, targetNodeId: string): Edge => {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    const targetNode = nodes.find((n) => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      return {
        id: `append-${sourceNodeId}-${targetNodeId}`,
        source: sourceNodeId,
        target: targetNodeId,
        animated: true,
        selectable: true,
        deletable:true,
        style: { stroke: '#f59e0b', strokeWidth: 2 },
        data: { connectionType: 'append' },
      };
    }

    const sourceHeight = sourceNode.measured?.height ?? 200;
    const targetHeight = targetNode.measured?.height ?? 200;

    const sourceHandles = {
      top: { x: sourceNode.position.x, y: sourceNode.position.y },
      bottom: { x: sourceNode.position.x, y: sourceNode.position.y + sourceHeight },
    };

    const targetHandles = {
      top: { x: targetNode.position.x, y: targetNode.position.y },
      bottom: { x: targetNode.position.x, y: targetNode.position.y + targetHeight },
    };

    const combinations: Array<{
      sourceHandle: 'top' | 'bottom';
      targetHandle: 'top' | 'bottom';
      distance: number;
    }> = (['top', 'bottom'] as const).flatMap((src) =>
      (['top', 'bottom'] as const).map((tgt) => {
        const dx = sourceHandles[src].x - targetHandles[tgt].x;
        const dy = sourceHandles[src].y - targetHandles[tgt].y;
        return {
          sourceHandle: src,
          targetHandle: tgt,
          distance: Math.sqrt(dx * dx + dy * dy),
        };
      }),
    );

    const shortest = combinations.reduce((a, b) => (a.distance < b.distance ? a : b));

    return {
      id: `append-${sourceNodeId}-${targetNodeId}`,
      source: sourceNodeId,
      sourceHandle: `${sourceNodeId}-${shortest.sourceHandle}`,
      target: targetNodeId,
      targetHandle: `${targetNodeId}-${shortest.targetHandle}`,
      animated: true,
      selectable: true,
      deletable: true,
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      data: { connectionType: 'append' },
    };
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) {
        console.warn('Ignoring self-connection');
        return;
      }

      const sourceHandle = connection.sourceHandle ?? undefined;
      const targetHandle = connection.targetHandle ?? undefined;

      // Append path via ReactFlow handles
      if (isAppendHandle(sourceHandle) && isAppendHandle(targetHandle)) {
        // Block if column edges already exist between these two nodes
        if (hasColumnEdge(edges, connection.source!, connection.target!)) {
          console.warn('Column mapping already exists — cannot append');
          return;
        }
        setPendingAppend({
          sourceNodeId: connection.source!,
          sourceNodeLabel:
            nodes.find((n) => n.id === connection.source)?.data.label ?? connection.source!,
          targetNodeId: connection.target!,
          targetNodeLabel:
            nodes.find((n) => n.id === connection.target)?.data.label ?? connection.target!,
        });
        setAppendModalOpen(true);
        return;
      }

      // Column mapping path (existing — unchanged)
      const extractCol = (handle?: string) =>
        handle ? handle.replace(/-(left|right)$/, '') : undefined;

      setPendingConnection({
        sourceNodeId: connection.source!,
        targetNodeId: connection.target!,
        sourceColumnId: extractCol(sourceHandle) ?? null,
        targetColumnId: extractCol(targetHandle) ?? null,
      });
      setModalOpen(true);
    },
    [nodes, edges],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSheetDrop = (e: CustomEvent) => {
      const { sourceNodeId, sourceNodeLabel, targetNodeId, targetNodeLabel } = e.detail;

      // Block if column edges already exist
      if (hasColumnEdge(edges, sourceNodeId, targetNodeId)) {
        console.warn('Column mapping already exists — cannot append');
        return;
      }

      setPendingAppend({ sourceNodeId, sourceNodeLabel, targetNodeId, targetNodeLabel });
      setAppendModalOpen(true);
    };

    container.addEventListener('sheet-handle-drop', handleSheetDrop as EventListener);
    return () =>
      container.removeEventListener('sheet-handle-drop', handleSheetDrop as EventListener);
  }, [edges]);

  // ── column-drop event (existing — unchanged) ──────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleColumnDrop = (e: CustomEvent) => {
      const { sourceNodeId, targetNodeId, sourceColumnId, targetColumnId } = e.detail;

      // Block if append edge already exists
      if (hasAppendEdge(edges, sourceNodeId, targetNodeId)) {
        console.warn('Sheets are already appended — cannot map columns');
        return;
      }

      setPendingConnection({ sourceNodeId, targetNodeId, sourceColumnId, targetColumnId });
      setModalOpen(true);
    };

    container.addEventListener('column-drop', handleColumnDrop as EventListener);
    return () => container.removeEventListener('column-drop', handleColumnDrop as EventListener);
  }, [edges]);

  // ── mapping-hover (existing — unchanged) ──────────────────────────────────

  useEffect(() => {
    const handleMappingHover = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const columnId: string | null = detail?.columnId ?? null;

      if (!columnId) {
        document.dispatchEvent(new CustomEvent('mapping-highlight', { detail: { columnIds: [] } }));
        return;
      }

      const connected = new Set<string>();
      connected.add(columnId);

      edges.forEach((edge) => {
        const src = edge.sourceHandle?.replace(/-(left|right)$/, '');
        const tgt = edge.targetHandle?.replace(/-(left|right)$/, '');
        if (src === columnId && tgt) connected.add(tgt);
        if (tgt === columnId && src) connected.add(src);
      });

      document.dispatchEvent(
        new CustomEvent('mapping-highlight', { detail: { columnIds: Array.from(connected) } }),
      );
    };

    document.addEventListener('mapping-hover', handleMappingHover as EventListener);
    return () => document.removeEventListener('mapping-hover', handleMappingHover as EventListener);
  }, [edges]);

  // ── append modal handlers ─────────────────────────────────────────────────

  const handleAppendConfirm = () => {
    if (!pendingAppend) return;
    const edge = buildAppendEdge(pendingAppend.sourceNodeId, pendingAppend.targetNodeId);
    setEdges((eds) => [...eds, edge]);
    setAppendModalOpen(false);
    setPendingAppend(null);
  };

  const handleAppendDecline = () => {
    // "No" → open column-mapping modal with first columns pre-selected
    if (!pendingAppend) return;
    setAppendModalOpen(false);
    setPendingConnection({
      sourceNodeId: pendingAppend.sourceNodeId,
      targetNodeId: pendingAppend.targetNodeId,
      sourceColumnId: null, // ConnectionModal falls back to first column
      targetColumnId: null,
    });
    setPendingAppend(null);
    setModalOpen(true);
  };

  // ── column-mapping modal confirm (existing) ───────────────────

  const handleModalConfirm = (sourceColumnId: string, targetColumnId: string) => {
    if (!pendingConnection) return;

    if (pendingConnection.sourceNodeId === pendingConnection.targetNodeId) {
      console.warn('Cannot create a connection within the same node');
      setModalOpen(false);
      setPendingConnection(null);
      return;
    }

    if (pendingConnection.sourceNodeId === pendingConnection.targetNodeId) {
      setModalOpen(false);
      setPendingConnection(null);
      return;
    }

    const normalizeHandle = (h?: string | null) => h?.replace(/-(left|right)$/, '');

    const sourceAlreadyUsed = edges.some(
      (edge) => normalizeHandle(edge.sourceHandle) === sourceColumnId,
    );

    const targetAlreadyUsed = edges.some(
      (edge) => normalizeHandle(edge.targetHandle) === targetColumnId,
    );

    if (sourceAlreadyUsed || targetAlreadyUsed) {
      toast.error('One or both selected columns are already connected');
      setModalOpen(false);
      setPendingConnection(null);
      return;
    }

    // Block if append edge already exists
    if (hasAppendEdge(edges, pendingConnection.sourceNodeId, pendingConnection.targetNodeId)) {
      console.warn('Sheets are already appended — cannot map columns');
      setModalOpen(false);
      setPendingConnection(null);
      return;
    }

    const { sourceHandle, targetHandle } = getOptimalHandles(
      pendingConnection.sourceNodeId,
      pendingConnection.targetNodeId,
      `${sourceColumnId}-right`,
      `${targetColumnId}-left`,
    );

    const newEdge: Edge = {
      id: `e-${pendingConnection.sourceNodeId}-${sourceColumnId}-${pendingConnection.targetNodeId}-${targetColumnId}`,
      source: pendingConnection.sourceNodeId,
      sourceHandle,
      target: pendingConnection.targetNodeId,
      targetHandle,
      animated: true,
      selectable: true,
      deletable: true
    };

    setEdges((eds) => {
      const color = pickEdgeColor(eds);
      return [...eds, { ...newEdge, style: { stroke: color } } as Edge];
    });

    setPendingConnection(null);
  };

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      if (connection.source === connection.target) return false;

      const normalizeHandle = (h?: string | null) => h?.replace(/-(left|right)$/, '');
      const incomingSourceCol = normalizeHandle(connection.sourceHandle);
      const incomingTargetCol = normalizeHandle(connection.targetHandle);

      // Block if source column already has an outgoing connection
      const sourceAlreadyUsed = edges.some(
        (edge) => normalizeHandle(edge.sourceHandle) === incomingSourceCol,
      );
      if (sourceAlreadyUsed) return false;

      // Block if target column already has an incoming connection
      const targetAlreadyUsed = edges.some(
        (edge) => normalizeHandle(edge.targetHandle) === incomingTargetCol,
      );
      if (targetAlreadyUsed) return false;

      const srcIsAppend = isAppendHandle(connection.sourceHandle);
      const tgtIsAppend = isAppendHandle(connection.targetHandle);
      if (srcIsAppend !== tgtIsAppend) return false;

      if (srcIsAppend) {
        return !hasAppendEdge(edges, connection.source!, connection.target!);
      } else {
        return !hasColumnEdge(edges, connection.source!, connection.target!);
      }
    },
    [edges],
  );

  // ── render ────────────────────────────────────────────────────────────────

  const sourceNode = pendingConnection
    ? (nodes.find((n) => n.id === pendingConnection.sourceNodeId)?.data ?? null)
    : null;
  const targetNode = pendingConnection
    ? (nodes.find((n) => n.id === pendingConnection.targetNodeId)?.data ?? null)
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
        connectionDragThreshold={999}
        isValidConnection={(connection) => isValidConnection(connection)}
        fitView
        deleteKeyCode='Delete'
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(220 15% 20%)" />
        <span className="absolute right-20 top-50">
          <Controls className="!bg-card !border-border !rounded-lg !shadow-xl" />
        </span>
      </ReactFlow>

      {/* Existing column-mapping modal */}
      <ConnectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPendingConnection(null);
        }}
        onConfirm={handleModalConfirm}
        sourceNode={sourceNode}
        targetNode={targetNode}
        initialSourceColumnId={pendingConnection?.sourceColumnId ?? null}
        initialTargetColumnId={pendingConnection?.targetColumnId ?? null}
      />

      {/* New append-confirm modal */}
      <AppendConfirmModal
        isOpen={appendModalOpen}
        sourceLabel={pendingAppend?.sourceNodeLabel ?? ''}
        targetLabel={pendingAppend?.targetNodeLabel ?? ''}
        onAppend={handleAppendConfirm}
        onMapInstead={handleAppendDecline}
        onClose={() => {
          setAppendModalOpen(false);
          setPendingAppend(null);
        }}
      />
    </div>
  );
};

export default FlowCanvas;
