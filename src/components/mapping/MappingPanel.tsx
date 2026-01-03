import { useState } from 'react';
import MappingItem from './MappingItem';
import type { MappingItem as MappingItemType } from '@/types/canvas.types';

const initialItems: MappingItemType[] = [
  {
    id: 'field-id',
    name: 'id',
    mappedColumn: {
      nodeId: 'users',
      nodeLabel: 'Users',
      columnId: 'users-id',
      columnName: 'User ID',
    },
  },
  {
    id: 'field-po-num',
    name: 'po_num',
    mappedColumn: {
      nodeId: 'posts',
      nodeLabel: 'Posts',
      columnId: 'posts-id',
      columnName: 'PO Number',
    },
  },
  {
    id: 'field-audit',
    name: 'audit_procedure',
  },
  {
    id: 'field-last-seen',
    name: 'last_seen',
  },
];

const MappingPanel = () => {
  const [items, setItems] = useState<MappingItemType[]>(initialItems);

  const handleColumnDrop = (
    itemId: string,
    columnData: { nodeId: string; nodeLabel: string; columnId: string; columnName: string },
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, mappedColumn: columnData } : item)),
    );
  };

  const mappedItems = items.filter((item) => item.mappedColumn);
  const unmappedItems = items.filter((item) => !item.mappedColumn);

  return (
    <div className="h-full bg-card border-r border-border p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-foreground mb-4">Field Mappings</h2>
      {unmappedItems.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Unmapped
          </h3>
          <div className="space-y-2">
            {unmappedItems.map((item) => (
              <MappingItem key={item.id} item={item} onDrop={handleColumnDrop} />
            ))}
          </div>
        </div>
      )}
      {mappedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            Mapped
          </h3>
          <div className="space-y-2">
            {mappedItems.map((item) => (
              <MappingItem key={item.id} item={item} onDrop={handleColumnDrop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingPanel;
