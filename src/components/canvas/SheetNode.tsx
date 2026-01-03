import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SheetNodeData } from '@/types/canvas.types';
import type { Node } from '@xyflow/react';
import { GripVertical } from 'lucide-react';

type SheetNodeType = Node<SheetNodeData, 'sheet'>;

const SheetNode = memo(({ data, id }: NodeProps<SheetNodeType>) => {
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
        {data.columns.map((column) => (
          <div 
            key={column.id} 
            className="sheet-node-row group cursor-grab active:cursor-grabbing"
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
              <GripVertical className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between gap-4 flex-1">
                <span className="font-mono text-foreground">{column.name}</span>
                <span className="text-muted-foreground text-xs font-mono">
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
        ))}
      </div>
    </div>
  );
});

SheetNode.displayName = 'SheetNode';

export default SheetNode;
