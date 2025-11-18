import { Button } from '@/components/ui/button';
import type{ AuditProcedure } from '@/types/index.types';
import { type ColumnDef } from '@tanstack/react-table';
import {Share2} from 'lucide-react'

export const auditProcedureColumns: ColumnDef<AuditProcedure>[] = [
  {
    accessorKey: 'category',
    header: 'CATEGORY',
    cell: ({ row }) => <div className="">{row.getValue('category')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => <div className="">{row.getValue('name')}</div>,
    },
    {
    accessorKey: 'description',
    header: 'DESCRIPTION',
    cell: ({ row }) => <div className="">{row.getValue('description')}</div>,
    },
    {
    accessorKey: 'document',
    header: 'DOCUMENT',
    cell: ({ row }) => <div className="">{row.getValue('document')}</div>,
    },
    {
    accessorKey: 'actions',
    header: 'ACTIONS',
    cell: () => {
      return (
        <div className="flex gap-4">
          <Button variant='ghost' size='icon-sm'>
            <Share2 className='h-4 w-4 text-muted-foreground'/>
            </Button>
        </div>
      );
    },
  },
];
