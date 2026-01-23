import { useState } from 'react';
import MappingItem from './MappingItem';
import type { MappingItem as MappingItemType } from '@/types/canvas.types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const initialItems: MappingItemType[] = [
  {
    id: 'field-id',
    name: 'User ID',
    mappingType: 'user',
    mappedColumn: {
      nodeId: 'users',
      nodeLabel: 'Users',
      columnId: 'users-id',
      columnName: 'id',
    },
  },
  {
    id: 'field-po-num',
    name: 'PO Number',
    mappingType: 'ai',
    confidenceScore: 85,
    mappedColumn: {
      nodeId: 'users',
      nodeLabel: 'Users',
      columnId: 'users-po_num',
      columnName: 'po_num',
    },
  },
  {
    id: 'field-vendor-name',
    name: 'Vendor Name',
    mappingType: 'ai',
    confidenceScore: 65,
    mappedColumn: {
      nodeId: 'comments',
      nodeLabel: 'Comments',
      columnId: 'comments-vendor_name',
      columnName: 'vendor_name',
    },
  },
  {
    id: 'field-amount',
    name: 'Transaction Amount',
    mappingType: 'ai',
    confidenceScore: 35,
    mappedColumn: {
      nodeId: 'posts',
      nodeLabel: 'Posts',
      columnId: 'posts-amount',
      columnName: 'amount',
    },
  },
  {
    id: 'field-pan-number',
    name: 'pan_number',
  },
  {
    id: 'field-last-seen',
    name: 'last_seen',
  },
  {
    id: 'field-status',
    name: 'status',
  },
];

const MappingPanel = () => {
  const [items, setItems] = useState<MappingItemType[]>(initialItems);

  const handleColumnDrop = (
    itemId: string,
    columnData: { nodeId: string; nodeLabel: string; columnId: string; columnName: string },
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, mappedColumn: columnData, mappingType: 'user' } : item)),
    );
  };

  const mappedItems = items.filter((item) => item.mappedColumn);
  const unmappedItems = items.filter((item) => !item.mappedColumn);

  return (
    <div className="h-full bg-card border-r border-border p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-foreground mb-4">Field Mappings</h2>
      <Accordion type="multiple" defaultValue={["mapped", "unmapped"]} className="w-full">
        <AccordionItem value="unmapped" className="border-none">
          <AccordionTrigger className="px-0 py-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm hover:cursor-pointer font-medium text-muted-foreground uppercase">Unmapped</span>
              <span className="text-sm text-muted-foreground">{unmappedItems.length}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pt-2 pb-0">
            {unmappedItems.length > 0 ? (
              <div className="space-y-2">
                {unmappedItems.map((item) => (
                  <MappingItem key={item.id} item={item} onDrop={handleColumnDrop} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No unmapped items</div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mapped" className="border-none mt-4">
          <AccordionTrigger className="px-0 py-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-muted-foreground uppercase  hover:cursor-pointer">Mapped</span>
              <span className="text-sm text-muted-foreground">{mappedItems.length}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pt-2 pb-0">
            {mappedItems.length > 0 ? (
              <div className="space-y-2">
                {mappedItems.map((item) => (
                  <MappingItem key={item.id} item={item} onDrop={handleColumnDrop} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No mapped items</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MappingPanel;
