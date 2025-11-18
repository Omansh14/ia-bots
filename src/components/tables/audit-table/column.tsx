import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AuditData } from '@/types/index.types';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getStatusBadgeVariant = (status: AuditData['status']) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In-Progress':
      return 'default';
    case 'Inactive':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const columns: ColumnDef<AuditData>[] = [
  {
    accessorKey: 'jobId',
    header: 'Job ID',
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <span 
        onClick={() => navigate (`${row.getValue('jobId')}`)}
        className="font-medium text-primary underline underline-offset-2 hover:cursor-pointer">
          {row.getValue('jobId')}
        </span>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <div>{row.getValue('location')}</div>,
  },
  {
    accessorKey: 'auditProcedures',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 hover:bg-transparent w-full justify-center"
        >
          Audit Procedures
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.getValue('auditProcedures')}</div>,
  },
  {
    accessorKey: 'exceptions',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 hover:bg-transparent w-full justify-center"
        >
          Exceptions
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        <span className="font-semibold text-destructive">{row.getValue('exceptions')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 hover:bg-transparent w-full justify-center"
        >
          Start Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.getValue('startDate')}</div>,
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 hover:bg-transparent w-full justify-center"
        >
          End Date
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.getValue('endDate')}</div>,
  },
  {
    accessorKey: 'createdOn',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 hover:bg-transparent w-full justify-center"
        >
          Created On
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-center">{row.getValue('createdOn')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as AuditData['status'];
      return (
        <div className="flex justify-center">
          <Badge className="rounded-full" variant={getStatusBadgeVariant(status)}>
            {status}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
  },
];
