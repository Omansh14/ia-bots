import React from 'react';
import { columns } from './columns';
import { Card, CardContent } from '../../ui/card';
import { Clients } from '@/constants';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientTable = () => {
  const data = React.useMemo(() => Clients, []);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const handleAddClient = () => {
    navigate('add-client');
  };

  return (
    <Card>
      <CardContent>
        <div className="flex mb-4 gap-3 w-full relative">
          <Input
            placeholder="Search Clients"
            className="pl-10 py-2"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(e) => {
              table.getColumn('name')?.setFilterValue(e.target.value);
            }}
          />
          <Search className="text-gray-500 h-4 w-4 absolute left-3 top-2" />
          <Button variant="default" onClick={handleAddClient} className="hover:cursor-pointer">
            <Plus className="w-10 h-10 text-white" />
            Add Client
          </Button>
        </div>
        <div className="rounded-sm">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>No results.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientTable;
