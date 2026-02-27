import { useState } from 'react';
import MappingItem from './MappingItem';
import type { MappingItem as MappingItemType } from '@/types/canvas.types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { SlidersHorizontal } from 'lucide-react';

const initialItems: MappingItemType[] = [
  {
    id: 'field-id',
    name: 'User ID',
    mappingType: 'user',
    procedure: 'Prevent duplicate vendors',
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
    procedure: 'Prevent duplicate vendors',
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
    procedure: 'Ensure PO–GRN–Invoice match',
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
    procedure: 'Unauthorized salary changes',
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
    procedure: 'Prevent duplicate vendors',
  },
  {
    id: 'field-last-seen',
    name: 'last_seen',
    procedure: 'Inactive vendor cleanup',
  },
  {
    id: 'field-status',
    name: 'status',
    procedure: 'Vendor performance monitoring',
  },
];

const MappingPanel = () => {
  const [items, setItems] = useState<MappingItemType[]>(initialItems);

  const handleColumnDrop = (
    itemId: string,
    columnData: { nodeId: string; nodeLabel: string; columnId: string; columnName: string },
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, mappedColumn: columnData, mappingType: 'user' } : item,
      ),
    );
  };

  const handleDeleteMapping = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, mappedColumn: undefined, mappingType: undefined } : item,
      ),
    );
  };

  const groupByProcedure = (items: MappingItemType[]) => {
    const groups: Record<string, MappingItemType[]> = {};
    items.forEach((item) => {
      const proc = item.procedure;
      if (!groups[proc]) groups[proc] = [];
      groups[proc].push(item);
    });
    return groups;
  };

  const allGroups = groupByProcedure(items);

  return (
    <div className="h-full bg-card border-r border-border p-4 overflow-y-auto">
      <div className="flex justify-between w-full items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Field Mappings</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Mapped</DropdownMenuLabel>
              <DropdownMenuItem>Unmapped</DropdownMenuItem>
              <DropdownMenuItem>All</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Accordion type="multiple" className="w-full">
        {Object.entries(allGroups).map(([procedure, items]) => {
          const total = items.length;
          const mappedCount = items.filter((i) => i.mappedColumn).length;
          const percentage = Math.round((mappedCount / total) * 100);
          return (
            <AccordionItem key={procedure} value={procedure}>
              <AccordionTrigger
                className="px-0 py-2 flex w-full items-center justify-between"
                asChild
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base hover:cursor-pointer font-medium text-muted-foreground max-w-[220px] truncate">
                    {procedure}
                  </span>
                  <div className="flex flex-col items-center">
                    <div style={{ width: 20, height: 20 }}>
                      <Tooltip>
                        <TooltipTrigger>
                          {percentage === 100 ? (
                            <img
                              src="/assets/check-circle-filled.svg"
                              alt={`${percentage}%`}
                              className="w-6 h-6"
                            />
                          ) : (
                            <CircularProgressbar
                              value={percentage}
                              styles={buildStyles({ pathColor: '#3CB043' })}
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>{percentage}%</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-2 bg-gray-50 border-t rounded-tl-sm border-l border-gray-200">
                <div className="space-y-2">
                  {items.map((item) => (
                    <MappingItem
                      key={item.id}
                      item={item}
                      onDrop={handleColumnDrop}
                      onDelete={handleDeleteMapping}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default MappingPanel;
