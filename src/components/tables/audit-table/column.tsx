import { Badge } from '@/components/ui/badge';
import moment, { type MomentInput } from 'moment';
import type { AuditData } from '@/types/index.types';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getStatusBadgeVariant = (status: AuditData['status']) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Draft':
      return 'warning';
    case 'Failed':
      return 'destructive';
    default:
      return 'default';
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
          onClick={() => navigate(`${row.getValue('jobId')}`)}
          className="font-medium text-primary underline underline-offset-2 hover:cursor-pointer"
        >
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
    accessorKey: 'totalProcedures',
    header: ({ column }) => {
      return (
        <span
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 hover:bg-transparent max-w- flex"
        >
          Procedures
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </span>
      );
    },
    cell: ({ row }) => {
      const totalvalue = row.original.totalProcedures;
      const approvedProcedures = row.original.approvedProcedures;
      return (
        <div className="pl-8">
          <span className="">{approvedProcedures}/</span>
          <span className="">{totalvalue}</span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'exceptions',
  //   header: ({ column }) => {
  //     return (
  //       <div
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         className="px-2 flex hover:bg-transparent w-full"
  //       >
  //         Exceptions
  //         {column.getIsSorted() === 'asc' ? (
  //           <ArrowUp className="ml-2 h-4 w-4" />
  //         ) : column.getIsSorted() === 'desc' ? (
  //           <ArrowDown className="ml-2 h-4 w-4" />
  //         ) : (
  //           <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
  //         )}
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const value = row.getValue('exceptions') as number;
  //     return (
  //       <div className="pl-10">
  //         <span className="font-semibold text-destructive">{String(value).padStart(3, '0')}</span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'createdOn',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex hover:bg-transparent w-full"
        >
          Created On
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </div>
      );
    },
    cell: ({ row }) => {
      const createdOn = row.getValue('createdOn') as MomentInput;
      const formattedDate = createdOn ? moment(createdOn).format('lll') : '';

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'runtime',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex hover:bg-transparent w-full"
        >
          Runtime
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </div>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue('runtime')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as AuditData['status'];
      return (
        <div className="flex">
          <Badge className="rounded-full" variant={getStatusBadgeVariant(status)}>
            {status}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
  },
];
