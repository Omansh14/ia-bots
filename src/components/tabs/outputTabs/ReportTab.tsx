import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';

const reportData = [
  { bot: "Validate Vendor KYC", issues: 64 },
  { bot: "PO-GRN-Invoice Match", issues: 38 },
  { bot: "Post-Invoice POs", issues: 12 },
  { bot: "Split Orders", issues: 2 },
  { bot: "Duplicate Vendors", issues: 1 },
];

export const ReportTab = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  type ReportRow = (typeof reportData)[number];

  const columns: ColumnDef<ReportRow>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected?.()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected?.(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: 'bot', header: 'Bot', cell: ({ row }) => <div className="font-medium">{row.getValue('bot')}</div> },
    { accessorKey: 'issues', header: 'Issues Found', cell: ({ row }) => <div className="text-right">{row.getValue('issues')}</div> },
  ];

  const table = useReactTable({
    data: reportData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => String(row.bot),
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.column.id === 'issues' ? 'text-right' : ''}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === 'issues' ? 'text-right' : ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button className="px-8">Download Detailed Report</Button>
      </div>
    </div>
  );
};