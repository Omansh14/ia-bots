import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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
import { ArrowLeft, RotateCcw, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bots } from '@/constants';
import Multiselect from 'multiselect-react-dropdown';

// Note: bots come from shared constants/types and are used as-is. Local detailed Bot type removed to avoid conflicts.

const Step1 = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<any>[] = [
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
              <div
                className="text-muted-foreground lg:max-w-2xl truncate hover:cursor-progress"
                aria-label={desc}
              >
                {desc}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="min-w-lg bg-blue-50">
              <div className="whitespace-pre-wrap text-sm text-foreground">{desc}</div>
            </HoverCardContent>
          </HoverCard>
        );
      },
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
  const indianCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Surat',
    'Jaipur',
  ];

  const locations = Array.from(
    new Set([...(bots as any).map((b: any) => b.location).filter(Boolean), ...indianCities]),
  );

  // Add common period options (merge with any periods present on bots)
  const periodOptions = ['Annually', 'Semi-Annually', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Financial year and industry options
  const fYearOptions = ['2024-25', '2023-24', '2022-23'];
  const industryOptions = [
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Technology',
    'Energy',
    'Education',
  ];

  const initialCompanies = [
    'Acme Corp',
    'TechStart Inc',
    'Global Industries',
    'Innovation Labs',
    'Tata Motors',
    'Tech Innovators',
    'Global Foods',
    'EcoBuild',
    'Finserve Solutions',
    'Greenwave Energy',
    'Apex Pharmaceuticals',
  ];

  const [companyList, setCompanyList] = useState<string[]>(initialCompanies);
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string[]>([]);
  const [fYearFilter, setFYearFilter] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);

  const [categoryFilterValue, setCategoryFilterValue] = useState<string[]>([]);

  // Load saved state from sessionStorage (if any) on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('step1');
      if (!raw) return;
      const data = JSON.parse(raw || '{}');
      if (data.selected_company) setCompanyFilter(data.selected_company);
      if (Array.isArray(data.selected_location)) setLocationFilter(data.selected_location);
      if (Array.isArray(data.selected_period)) setPeriodFilter(data.selected_period);
      if (Array.isArray(data.selected_financial_year)) setFYearFilter(data.selected_financial_year);
      if (Array.isArray(data.selected_industry)) setIndustryFilter(data.selected_industry);
      if (Array.isArray(data.company_list) && data.company_list.length > 0) {
        setCompanyList((prev) => Array.from(new Set([...prev, ...data.company_list])));
      }

      // Restore selected bots by matching stored bot ids to rows (stored bots are full objects)
      if (Array.isArray(data.selected_bots) && data.selected_bots.length > 0) {
        const selection: RowSelectionState = {};
        const storedIds = data.selected_bots.map((b: any) => b?.id).filter(Boolean);
        table.getRowModel().rows.forEach((row) => {
          const rowId = (row.original as any)?.id ?? row.id;
          if (storedIds.includes(rowId)) {
            selection[row.id] = true;
          }
        });
        setRowSelection(selection);
        try {
          table.setRowSelection?.(selection);
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist step1 data to localStorage whenever relevant state changes
  useEffect(() => {
    try {
      const selectedBotsObjects = table
        .getRowModel()
        .rows.filter((r) => Boolean(rowSelection[r.id]))
        .map((r) => r.original as any);

      const payload = {
        selected_company: companyFilter || null,
        selected_location: locationFilter.length > 0 ? locationFilter : null,
        selected_period: periodFilter.length > 0 ? periodFilter : null,
        selected_financial_year: fYearFilter.length > 0 ? fYearFilter : null,
        selected_industry: industryFilter.length > 0 ? industryFilter : null,
        // store full bot objects for selected bots
        selected_bots: selectedBotsObjects,
        company_list: companyList,
      };

      sessionStorage.setItem('step1', JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
  }, [
    companyFilter,
    locationFilter,
    periodFilter,
    fYearFilter,
    industryFilter,
    rowSelection,
    companyList,
    table,
  ]);

  // Transform location array to options format for Multiselect
  const locationOptions = locations.map((loc) => ({
    id: loc,
    name: loc,
  }));

  // Transform period options to Multiselect format
  const periodOptions_ms = [
    ...new Set([...(bots as any).map((bot: any) => bot.period).filter(Boolean), ...periodOptions]),
  ].map((period: any) => ({ id: period, name: period }));

  // Transform financial year options to Multiselect format
  const fYearOptions_ms = [
    ...new Set([...(bots as any).map((bot: any) => bot.fYear).filter(Boolean), ...fYearOptions]),
  ].map((year: any) => ({ id: year, name: year }));

  // Transform industry options to Multiselect format
  const industryOptions_ms = [
    ...new Set([
      ...(bots as any).map((bot: any) => bot.industry).filter(Boolean),
      ...industryOptions,
    ]),
  ].map((industry: any) => ({ id: industry, name: industry }));

  // Transform category options to Multiselect format
  const categoryOptions_ms = [
    { id: 'P2P', name: 'P2P' },
    { id: 'H2R', name: 'H2R' },
    { id: 'O2C', name: 'O2C' },
  ];
  return (
    <div className="mx-auto w-full py-4 sm:pr-2 lg:pr-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Client Details</h1>
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
            <Label htmlFor="company" className="text-sm font-medium">
              Company
            </Label>
            <Multiselect
              options={companyList.map((c) => ({ id: c, name: c }))}
              showCheckbox={true}
              selectedValues={(Array.isArray(companyFilter) ? companyFilter : [companyFilter])
                .filter(Boolean)
                .map((c) => ({ id: c, name: c }))}
              onSelect={(selectedList: any) => {
                setCompanyFilter(selectedList.map((item: any) => item.id));
              }}
              onRemove={(selectedList: any) => {
                setCompanyFilter(selectedList.map((item: any) => item.id));
              }}
              displayValue="name"
              placeholder="Select company"
              closeIcon="cancel"
              className="max-h-10 text-sm rounded-3xl"
              // Allow user to add new company
              onSearch={(query: string) => {
                if (
                  query &&
                  !companyList.some((c) => c.toLowerCase() === query.trim().toLowerCase())
                ) {
                  setCompanyList((prev) => [...prev, query.trim()]);
                }
              }}
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="location" className="mb-3">
              Location
            </Label>
            <Multiselect
              options={locationOptions}
              showCheckbox={true}
              selectedValues={
                locationFilter
                  .map((loc) => locationOptions.find((o) => o.id === loc))
                  .filter(Boolean) as any
              }
              onSelect={(selectedList: any) => {
                setLocationFilter(selectedList.map((item: any) => item.id));
              }}
              onRemove={(selectedList: any) => {
                setLocationFilter(selectedList.map((item: any) => item.id));
              }}
              className="max-h-10 text-sm rounded-3xl"
              displayValue="name"
              placeholder="Select location"
              closeIcon="cancel"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="period" className="mb-3">
              Period
            </Label>
            <Multiselect
              options={periodOptions_ms}
              selectedValues={
                periodFilter
                  .map((period) => periodOptions_ms.find((o) => o.id === period))
                  .filter(Boolean) as any
              }
              className="max-h-10 text-sm rounded-3xl"
              onSelect={(selectedList: any) => {
                setPeriodFilter(selectedList.map((item: any) => item.id));
              }}
              onRemove={(selectedList: any) => {
                setPeriodFilter(selectedList.map((item: any) => item.id));
              }}
              displayValue="name"
              placeholder="Select period"
              closeIcon="cancel"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="financial-year" className="mb-3">
              Financial Year
            </Label>
            <Multiselect
              options={fYearOptions_ms}
              className="max-h-10 text-sm rounded-3xl"
              selectedValues={
                fYearFilter
                  .map((year) => fYearOptions_ms.find((o) => o.id === year))
                  .filter(Boolean) as any
              }
              onSelect={(selectedList: any) => {
                setFYearFilter(selectedList.map((item: any) => item.id));
              }}
              onRemove={(selectedList: any) => {
                setFYearFilter(selectedList.map((item: any) => item.id));
              }}
              displayValue="name"
              placeholder="Select financial year"
              closeIcon="cancel"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="industry" className="mb-3">
              Industry
            </Label>
            <Multiselect
              className="max-h-10 text-sm rounded-3xl"
              options={industryOptions_ms}
              selectedValues={
                industryFilter
                  .map((industry) => industryOptions_ms.find((o) => o.id === industry))
                  .filter(Boolean) as any
              }
              onSelect={(selectedList: any) => {
                setIndustryFilter(selectedList.map((item: any) => item.id));
              }}
              onRemove={(selectedList: any) => {
                setIndustryFilter(selectedList.map((item: any) => item.id));
              }}
              displayValue="name"
              placeholder="Select industry"
              closeIcon="cancel"
            />
          </div>
        </div>
      </div>

      {/* Select Bots Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex justify-between">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">
            Select Procedures
          </h2>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">{selectedCount}</span>/{bots.length} selected
          </span>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-4 w-full items-center px-2">
          <div className="relative w-4/5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-background pl-9"
            />
          </div>
          {/* Category Badge and Actions */}
          <div className="w-1/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block max-w-24">
                <Multiselect
                  options={categoryOptions_ms}
                  showCheckbox={true}
                  selectedValues={
                    categoryFilterValue
                      .map((cat: string) => categoryOptions_ms.find((o) => o.id === cat))
                      .filter(Boolean) as any
                  }
                  onSelect={(selectedList: any) => {
                    const values = selectedList.map((item: any) => item.id);
                    setCategoryFilterValue(values);
                    try {
                      const col = table.getColumn('category');
                      if (col) {
                        col.setFilterValue(values.length > 0 ? values : undefined);
                      }
                    } catch (e) {
                      // ignore
                    }
                  }}
                  onRemove={(selectedList: any) => {
                    const values = selectedList.map((item: any) => item.id);
                    setCategoryFilterValue(values);
                    try {
                      const col = table.getColumn('category');
                      if (col) {
                        col.setFilterValue(values.length > 0 ? values : undefined);
                      }
                    } catch (e) {
                      // ignore
                    }
                  }}
                  displayValue="name"
                  placeholder="Category"
                  closeIcon="cancel"
                  className="text-sm"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-100">
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
