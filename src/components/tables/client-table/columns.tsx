import type { Client } from '@/types/index.types';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../ui/badge';
import moment, { type MomentInput } from 'moment';
import { Share2, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'client_id',
    header: 'CLIENT ID',
    cell: ({ row }) => {
      const navigate = useNavigate()
      return (
        <div 
        onClick={() => navigate(`${row.getValue('client_id')}`, {state: {client: row.getValue('name')}})}
        className="underline underline-offset-2 text-primary hover:cursor-pointer">{row.getValue('client_id')}</div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'CLIENT NAME',
    cell: ({ row }) => {
      const name = String(row.getValue('name') || '');
      const firstLetter = name[0]?.toUpperCase() || '';
      return (
        <div className="flex gap-3">
          <span className="h-6 w-6 text-center flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            {firstLetter}
          </span>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: 'industry',
    header: 'INDUSTRY',
    cell: ({ row }) => (
      <Badge variant="default" className="text-xs bg-purple-200 text-purple-800 px-2  rounded-full">
        {row.getValue('industry')}
      </Badge>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: 'TIMESTAMP',
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as MomentInput;
      const formattedDate = timestamp ? moment(timestamp).format('llll') : '';
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'audit_procedures',
    header: 'AUDIT PROCEDURES',
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue('audit_procedures')}</div>
    ),
  },
  {
    accessorKey: 'action',
    header: 'ACTION',
    cell: ({ row }) => {
      const actions = (row.getValue('action') || []) as string[];
      const showShare = actions.includes('share');
      const showDelete = actions.includes('delete');

      return (
        <div className="flex items-center gap-2">
          {showShare && (
            <button
              type="button"
              title="Share"
              className="p-1 rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: implement share handler
              }}
            >
              <Share2 className="h-5 w-5 text-blue-600" />
            </button>
          )}

          {showDelete && (
            <button
              type="button"
              title="Delete"
              className="p-1 rounded hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: implement delete handler
              }}
            >
              <Trash className="h-5 w-5 text-red-600" />
            </button>
          )}
        </div>
      );
    },
  },
];
