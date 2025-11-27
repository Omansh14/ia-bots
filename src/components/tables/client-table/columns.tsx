import type { Client } from '@/types/index.types';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import moment, { type MomentInput } from 'moment';
import { useNavigate } from 'react-router-dom';

const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() ?? '';
};

export const columns: ColumnDef<Client>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      const initials = getInitials(name);
      return (
        <div className="flex gap-3 items-center">
          <span className="h-8 w-8 text-center flex items-center justify-center rounded-full bg-blue-100 text-blue-700">
            {initials}
          </span>
          <span className="text-center">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'industry',
    header: 'INDUSTRY',
    cell: ({ row }) => (
      <Badge variant="default" className="text-xs bg-purple-200 text-purple-800 px-2 rounded-full">
        {row.getValue('industry')}
      </Badge>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: 'CREATED ON',
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as MomentInput;
      const formattedDate = timestamp ? moment(timestamp).format('lll') : '';
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'audit_procedures',
    header: 'AUDIT PROCEDURES',
    cell: ({ row }) => (
      <div className="flex px-10">{row.getValue('audit_procedures')}</div>
    ),
  },
  {
    accessorKey: 'lastrun',
    header: 'LAST RUN',
    cell: ({ row }) => {
      const lastRun = row.getValue('lastrun') as MomentInput;
      const formattedDate = lastRun ? moment(lastRun).format('lll')  : 'Never';
      return <div>{formattedDate}</div>;
    },
  }, 
];
