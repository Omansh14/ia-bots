import { memo, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SheetNodeData } from '@/types/canvas.types';
import type { Node } from '@xyflow/react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type SheetNodeType = Node<SheetNodeData, 'sheet'>;

const SheetNode = memo(({ data, id }: NodeProps<SheetNodeType>) => {
  const [hoveredColumnIds, setHoveredColumnIds] = useState<string[]>([]);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);

  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const ids = Array.isArray(detail?.columnIds)
        ? detail.columnIds
        : detail?.columnId
          ? [detail.columnId]
          : [];
      setHoveredColumnIds(ids || []);
    };
    document.addEventListener('mapping-highlight', handleHighlight as EventListener);
    return () =>
      document.removeEventListener('mapping-highlight', handleHighlight as EventListener);
  }, []);

  // --- Existing column drag handlers (unchanged) ---
  const handleDragStart = (e: React.DragEvent, columnId: string, columnName: string) => {
    setDraggingColumnId(columnId);
    e.dataTransfer.setData(
      'application/column',
      JSON.stringify({ nodeId: id, columnId, nodeLabel: data.label, columnName }),
    );
    e.dataTransfer.effectAllowed = 'link';
  };

  const handleDragEnd = () => {
    setDraggingColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const columnData = e.dataTransfer.getData('application/column');
    if (columnData) {
      const parsed = JSON.parse(columnData);
      if (parsed.nodeId !== id) {
        const event = new CustomEvent('column-drop', {
          detail: {
            sourceNodeId: parsed.nodeId,
            sourceColumnId: parsed.columnId,
            targetNodeId: id,
            targetColumnId,
          },
          bubbles: true,
        });
        e.currentTarget.dispatchEvent(event);
      }
    }
  };

  // --- NEW: Sheet-level drag from header (top/bottom handle area) ---
  const handleSheetDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/sheet',
      JSON.stringify({ nodeId: id, nodeLabel: data.label }),
    );
    e.dataTransfer.effectAllowed = 'link';
    // Stop propagation so ReactFlow doesn't treat this as a node drag
    e.stopPropagation();
  };

  const handleSheetDragOver = (e: React.DragEvent) => {
    // Only accept sheet drags, not column drags
    if (e.dataTransfer.types.includes('application/sheet')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'link';
      setIsDropTarget(true);
    }
  };

  const handleSheetDragLeave = () => {
    setIsDropTarget(false);
  };

  const handleSheetDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);

    const sheetData = e.dataTransfer.getData('application/sheet');
    if (sheetData) {
      const parsed = JSON.parse(sheetData);
      if (parsed.nodeId !== id) {
        const event = new CustomEvent('sheet-handle-drop', {
          detail: {
            sourceNodeId: parsed.nodeId,
            sourceNodeLabel: parsed.nodeLabel,
            targetNodeId: id,
            targetNodeLabel: data.label,
          },
          bubbles: true,
        });
        e.currentTarget.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="sheet-node">
      {/* Top handle — draggable for sheet append */}
      <div
        className={cn(
          'flex justify-center items-center  active:cursor-grabbing',
          'relative transition-colors',
          isDropTarget && 'bg-amber-500/20',
        )}
        draggable
        onDragStart={handleSheetDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleSheetDragOver}
        onDragLeave={handleSheetDragLeave}
        onDrop={handleSheetDrop}
      >
        <Handle
          type="source"
          position={Position.Top}
          id={`${id}-top`}
          className="!w-4 !h-2 !rounded-sm !bg-amber-500 !border-amber-600 !relative !transform-none !top-auto !left-auto"
        />
      </div>

      <div
        className={cn(
          'sheet-node-header',
          isDropTarget && 'ring-2 ring-amber-500 ring-inset',
        )}
        onDragOver={handleSheetDragOver}
        onDragLeave={handleSheetDragLeave}
        onDrop={handleSheetDrop}
      >
        <span className="text-primary">{data.label}</span>
      </div>

      <div className="flex flex-col">
        {data.columns.map((column) => {
          const isHighlighted = hoveredColumnIds.includes(column.id);
          return (
            <div
              key={column.id}
              className={cn(
                'sheet-node-row group cursor-grab active:cursor-grabbing',
                isHighlighted && 'bg-blue-600',
              )}
              draggable
              onDragOver={handleDragOver}
              onDragStart={(e) => handleDragStart(e, column.id, column.name)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <Handle
                type="source"
                position={Position.Left}
                id={`${column.id}-left`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                isConnectable={draggingColumnId !== column.id}
              />
              <div className="flex items-center gap-2">
                <GripVertical
                  className={cn(
                    'w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity',
                    isHighlighted ? 'text-white' : 'text-muted-foreground',
                  )}
                />
                <div className="flex items-center justify-between gap-4 flex-1">
                  <span className={cn('font-mono', isHighlighted ? 'text-white' : 'text-foreground')}>
                    {column.name}
                  </span>
                  <span className={cn('text-xs font-mono', isHighlighted ? 'text-white' : 'text-muted-foreground')}>
                    {column.type}
                  </span>
                </div>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`${column.id}-right`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                isConnectable={draggingColumnId !== column.id}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom handle — drop target for sheet append */}
      <div
        className={cn(
          'flex justify-center items-center cursor-grab active:cursor-grabbing',
          'relative transition-colors',
          isDropTarget && 'bg-amber-500/20',
        )}
        draggable
        onDragStart={handleSheetDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleSheetDragOver}
        onDragLeave={handleSheetDragLeave}
        onDrop={handleSheetDrop}
      >
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-bottom`}
          className="!w-4 !h-2 !rounded-sm !bg-amber-500 !border-amber-600 !relative !transform-none !bottom-auto !left-auto"
        />
      </div>
    </div>
  );
});

SheetNode.displayName = 'SheetNode';
export default SheetNode;