import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  RotateCcw,
  Search,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  Sparkle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bots } from '@/constants';
import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';

// Define the bot type based on your data structure
type Bot = {
  id: string;
  category: string;
  auditProcedure: string;
  description: string;
  documentForEvidence: string;
  company?: string;
  location?: string;
  period?: string;
  fYear?: string;
  industry?: string;
};

const Step1 = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Define columns with TanStack Table
  const columns: ColumnDef<Bot>[] = [
    // (Removed company/location/period/fYear/industry columns — filters now independent UI)
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
      accessorKey: 'category',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium pl-4">{row.getValue('category')}</div>,
    },
    {
      accessorKey: 'auditProcedure',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Audit Procedures
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('auditProcedure')}</div>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const desc = String(row.getValue('description') ?? '');
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="text-muted-foreground max-w-lg truncate hover:cursor-progress" aria-label={desc}>
                {desc}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className='min-w-lg bg-blue-50'>
              <div className="whitespace-pre-wrap text-sm text-foreground">{desc}</div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: 'documentForEvidence',
      header: 'Document for Evidence',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('documentForEvidence')}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: bots,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getRowId: (row) => row.id, // Use bot id as row id for selection
  });

  const handleReset = () => {
    // Clear local state
    setRowSelection({});
    setGlobalFilter('');
    setSorting([]);
    setColumnFilters([]);

    // Also clear table internal filters/state so Selects and table reflect reset immediately
    try {
      table.setRowSelection?.({});
      table.setGlobalFilter?.('');
      table.setSorting?.([]);
      table.setColumnFilters?.([]);
    } catch (e) {
      // silent - in case methods are not available in some environments
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  // derive unique companies and locations from bots
  const companies = [...new Set(bots.map((b) => b.company))];
  const locations = [...new Set(bots.map((b) => b.location))];

  // Local filter states (these are independent of the table columns)
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [fYearFilter, setFYearFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const selectedIndustry = industryFilter || 'All';

  return (
    <div className="mx-auto w-full py-4 sm:pr-2 lg:pr-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Client</h1>
            <p className="text-sm text-muted-foreground">
              Add client details and handpick the bots that will drive your automation
            </p>
          </div>
        </div>
        <Button size="lg" className="hover:cursor-pointer" onClick={() => navigate('upload-data')}>
          Save & Next
        </Button>
      </div>

      {/* Basic Details Section */}
      <div className="mb-2 p-6">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">Basic Details</h2>
        <div className="flex gap-4 flex-1 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="company">Company</Label>
            <Select
              value={companyFilter}
              onValueChange={(value) => setCompanyFilter(value)}
            >
              <SelectTrigger id="company" className="bg-background w-full">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="location">Location</Label>
            <Select
              value={locationFilter}
              onValueChange={(value) => setLocationFilter(value)}
            >
              <SelectTrigger id="location" className="bg-background w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="period">Period</Label>
            <Select
              value={periodFilter}
              onValueChange={(value) => setPeriodFilter(value)}
            >
              <SelectTrigger id="period" className="bg-background w-full">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {[...new Set(bots.map((bot) => bot.period))].map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="financial-year">Financial Year</Label>
            <Select
              value={fYearFilter}
              onValueChange={(value) => setFYearFilter(value)}
            >
              <SelectTrigger id="financial-year" className="bg-background w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {[...new Set(bots.map((bot) => bot.fYear))].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={industryFilter}
              onValueChange={(value) => setIndustryFilter(value)}
            >
              <SelectTrigger id="industry" className="bg-background w-full">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {[...new Set(bots.map((bot) => bot.industry))].map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Select Bots Section */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold text-card-foreground">Select Bots</h2>

        {/* Category Badge and Actions */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {
              selectedIndustry && selectedIndustry !== 'All' ? (
                <Badge variant="outline" className="gap-2 px-3 py-1.5">
                  <Sparkle className="h-4 w-4 fill-purple-300" />
                  <span className="font-medium">{selectedIndustry}</span>
                </Badge>
              ) : null
            }
            <span className="text-sm text-muted-foreground">
              Selected <span className="font-medium text-primary">{selectedCount}</span>/
              {bots.length} bots
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Category
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-background pl-9"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className='bg-gray-50'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedCount} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
