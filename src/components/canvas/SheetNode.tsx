import { memo, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SheetNodeData } from '@/types/canvas.types';
import type { Node } from '@xyflow/react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';


type SheetNodeType = Node<SheetNodeData, 'sheet'>;

const SheetNode = memo(({ data, id }: NodeProps<SheetNodeType>) => {
  const [hoveredColumnIds, setHoveredColumnIds] = useState<string[]>([]);

  useEffect(() => {
    const handleHighlight = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      // Accept both { columnIds: [] } (preferred) and legacy { columnId }
      const ids = Array.isArray(detail?.columnIds)
        ? detail.columnIds
        : detail?.columnId
        ? [detail.columnId]
        : [];
      setHoveredColumnIds(ids || []);
    };

    document.addEventListener('mapping-highlight', handleHighlight as EventListener);
    return () => document.removeEventListener('mapping-highlight', handleHighlight as EventListener);
  }, []);

  const handleDragStart = (e: React.DragEvent, columnId: string, columnName: string) => {
    e.dataTransfer.setData('application/column', JSON.stringify({
      nodeId: id,
      columnId,
      nodeLabel: data.label,
      columnName,
    }));
    e.dataTransfer.effectAllowed = 'link';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const columnData = e.dataTransfer.getData('application/column');
    if (columnData) {
      const parsed = JSON.parse(columnData);
      if (parsed.nodeId !== id) {
        // Dispatch custom event for the parent to handle
        const event = new CustomEvent('column-drop', {
          detail: {
            sourceNodeId: parsed.nodeId,
            targetNodeId: id,
          },
          bubbles: true,
        });
        e.currentTarget.dispatchEvent(event);
      }
    }
  };

  return (
    <div 
      className="sheet-node"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="sheet-node-header">
        <span className="text-primary">{data.label}</span>
      </div>
      <div className="flex flex-col">
        {data.columns.map((column) => {
          const isHighlighted = hoveredColumnIds.includes(column.id);
          return (
            <div 
              key={column.id} 
              className={cn(
                "sheet-node-row group cursor-grab active:cursor-grabbing",
                isHighlighted && 'bg-blue-600'
              )}
              draggable
              onDragStart={(e) => handleDragStart(e, column.id, column.name)}
              
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`${column.id}-target`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
              <div className="flex items-center gap-2">
                <GripVertical className={cn("w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity", isHighlighted ? 'text-white' : 'text-muted-foreground')} />
                <div className="flex items-center justify-between gap-4 flex-1">
                  <span className={cn("font-mono", isHighlighted ? 'text-white' : 'text-foreground')}>{column.name}</span>
                  <span className={cn("text-xs font-mono", isHighlighted ? 'text-white' : 'text-muted-foreground')}>
                    {column.type}
                  </span>
                </div>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`${column.id}-source`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

SheetNode.displayName = 'SheetNode';

export default SheetNode;
