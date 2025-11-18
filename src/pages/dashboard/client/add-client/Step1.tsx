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
  ArrowLeft,
  RotateCcw,
  Search,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  Sparkle,
  ChevronsUpDown,
  Check,
  Plus,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bots } from '@/constants';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Note: bots come from shared constants/types and are used as-is. Local detailed Bot type removed to avoid conflicts.

const Step1 = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companySearchValue, setCompanySearchValue] = useState('');

  function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
  }

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
                className="text-muted-foreground max-w-lg truncate hover:cursor-progress"
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
    // {
    //   accessorKey: 'documentForEvidence',
    //   header: 'Document for Evidence',
    //   cell: ({ row }) => (
    //     <div className="text-muted-foreground">{row.getValue('documentForEvidence')}</div>
    //   ),
    // },
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
  // const companies = [...new Set(bots.map((b) => b.company))];
  // Add some top Indian cities as dummy locations to ensure the select has common values
  const indianCities = ['Mumbai','Delhi','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad','Surat','Jaipur'];

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

  const initialCompanies = ['Acme Corp', 'TechStart Inc', 'Global Industries', 'Innovation Labs', 'Tata Motors', 'Tech Innovators', 'Global Foods', 'EcoBuild', 'Finserve Solutions', 'Greenwave Energy', 'Apex Pharmaceuticals'];

  const [companyList, setCompanyList] = useState<string[]>(initialCompanies);
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [fYearFilter, setFYearFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const selectedIndustry = industryFilter || 'All';
  const [categoryFilterValue, setCategoryFilterValue] = useState('all');

  // Load saved state from sessionStorage (if any) on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('step1');
      if (!raw) return;
      const data = JSON.parse(raw || '{}');
      if (data.selected_company) setCompanyFilter(data.selected_company);
      if (data.selected_location) setLocationFilter(data.selected_location);
      if (data.selected_period) setPeriodFilter(data.selected_period);
      if (data.selected_financial_year) setFYearFilter(data.selected_financial_year);
      if (data.selected_industry) setIndustryFilter(data.selected_industry);
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
      const selectedBotsObjects = table.getRowModel().rows
        .filter((r) => Boolean(rowSelection[r.id]))
        .map((r) => (r.original as any));

      const payload = {
        selected_company: companyFilter || null,
        selected_location: locationFilter || null,
        selected_period: periodFilter || null,
        selected_financial_year: fYearFilter || null,
        selected_industry: industryFilter || null,
        // store full bot objects for selected bots
        selected_bots: selectedBotsObjects,
        company_list: companyList,
      };

      sessionStorage.setItem('step1', JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
  }, [companyFilter, locationFilter, periodFilter, fYearFilter, industryFilter, rowSelection, companyList, table]);

  const handleAddCompany = () => {
    const trimmedValue = companySearchValue.trim();
    if (trimmedValue && !companyList.includes(trimmedValue)) {
      setCompanyList([...companyList, trimmedValue]);
      setCompanyFilter(trimmedValue);
      setCompanySearchValue('');
      setCompanyOpen(false);
    }
  };

  const showAddOption =
    companySearchValue.trim() !== '' &&
    !companyList.some((c) => c.toLowerCase() === companySearchValue.trim().toLowerCase());

  const filteredCompanies = companyList.filter((company) =>
    company.toLowerCase().includes(companySearchValue.toLowerCase()),
  );
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
            <Label htmlFor="company" className="text-sm font-medium">
              Company
            </Label>
            <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={companyOpen}
                  className="w-full justify-between bg-white hover:bg-gray-50"
                >
                  <span className={cn(!companyFilter && 'text-gray-500')}>
                    {companyFilter || 'Select company'}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="flex flex-col">
                  {/* Search Input */}
                  <div className="flex items-center border-b px-3">
                    <Input
                      placeholder="Search or add company..."
                      value={companySearchValue}
                      onChange={(e) => setCompanySearchValue(e.target.value)}
                      className="h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && showAddOption) {
                          handleAddCompany();
                        }
                      }}
                    />
                    {companySearchValue && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setCompanySearchValue('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredCompanies.length === 0 && !showAddOption && (
                      <div className="px-3 py-6 text-center text-sm text-gray-500">
                        No company found.
                      </div>
                    )}

                    {filteredCompanies.map((company) => (
                      <button
                        key={company}
                        onClick={() => {
                          setCompanyFilter(company === companyFilter ? '' : company);
                          setCompanyOpen(false);
                          setCompanySearchValue('');
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            companyFilter === company ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {company}
                      </button>
                    ))}

                    {showAddOption && (
                      <button
                        onClick={handleAddCompany}
                        className="w-full flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add "{companySearchValue}"
                      </button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="location" className="mb-3">
              Location
            </Label>
            <Select value={locationFilter} onValueChange={(value) => setLocationFilter(value)}>
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
            <Label htmlFor="period" className="mb-3">
              Period
            </Label>
            <Select value={periodFilter} onValueChange={(value) => setPeriodFilter(value)}>
              <SelectTrigger id="period" className="bg-background w-full">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {[...new Set([...(bots as any).map((bot: any) => bot.period).filter(Boolean), ...periodOptions])].map((period: any) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="financial-year" className="mb-3">
              Financial Year
            </Label>
            <Select value={fYearFilter} onValueChange={(value) => setFYearFilter(value)}>
              <SelectTrigger id="financial-year" className="bg-background w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {[...new Set([...(bots as any).map((bot: any) => bot.fYear).filter(Boolean), ...fYearOptions])].map((year: any) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="industry" className="mb-3">
              Industry
            </Label>
            <Select value={industryFilter} onValueChange={(value) => setIndustryFilter(value)}>
              <SelectTrigger id="industry" className="bg-background w-full">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {[...new Set([...(bots as any).map((bot: any) => bot.industry).filter(Boolean), ...industryOptions])].map((industry: any) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
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
            {selectedIndustry && selectedIndustry !== 'All' ? (
              <Badge variant="outline" className="gap-2 px-3 py-1.5">
                <Sparkle className="h-4 w-4 fill-purple-300" />
                <span className="font-medium">{selectedIndustry}</span>
              </Badge>
            ) : null}
            <span className="text-sm text-muted-foreground">
              Selected <span className="font-medium text-primary">{selectedCount}</span>/
              {bots.length} bots
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Select
                value={categoryFilterValue}
                onValueChange={(value) => {
                  setCategoryFilterValue(value);
                  try {
                    const col = table.getColumn('category');
                    if (col) {
                      // treat 'all' as clear
                      col.setFilterValue(value === 'all' ? undefined : value);
                    }
                  } catch (e) {
                    // ignore
                  }
                }}
              >
                <SelectTrigger className="h-8 w-40 bg-background">
                  <LayoutGrid className="mr-1 h-4 w-4 text-gray-700" />
                  <SelectValue placeholder="Category" />
                  
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="P2P">P2P</SelectItem>
                  <SelectItem value="H2R">H2R</SelectItem>
                  <SelectItem value="O2C">O2C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
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
