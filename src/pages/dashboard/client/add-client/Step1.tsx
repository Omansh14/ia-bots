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
import ReactSelect from 'react-select';

// Option type for react-select
interface OptionType {
  value: string;
  label: string;
}

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
      filterFn: (row, columnId, filterValue) => {
        if (Array.isArray(filterValue) && filterValue.length > 0) {
          const rowValue = row.getValue(columnId) as string;
          return filterValue.includes(rowValue);
        }
        return true;
      },
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
    getRowId: (row) => row.id,
  });

  const handleReset = () => {
    setRowSelection({});
    setGlobalFilter('');
    setSorting([]);
    setColumnFilters([]);
    setCompanyFilter([]);
    setLocationFilter([]);
    setPeriodFilter([]);
    setFYearFilter([]);
    setIndustryFilter([]);
    setCategoryFilterValue([]);

    try {
      table.setRowSelection?.({});
      table.setGlobalFilter?.('');
      table.setSorting?.([]);
      table.setColumnFilters?.([]);
    } catch (e) {
      // silent
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
  const periodOptions = ['Annually', 'Semi-Annually', 'Q1', 'Q2', 'Q3', 'Q4'];
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
  const [companyFilter, setCompanyFilter] = useState<OptionType[]>([]);
  const [locationFilter, setLocationFilter] = useState<OptionType[]>([]);
  const [periodFilter, setPeriodFilter] = useState<OptionType[]>([]);
  const [fYearFilter, setFYearFilter] = useState<OptionType[]>([]);
  const [industryFilter, setIndustryFilter] = useState<OptionType[]>([]);
  const [categoryFilterValue, setCategoryFilterValue] = useState<OptionType[]>([]);

  // Load saved state from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('step1');
      if (!raw) return;
      const data = JSON.parse(raw || '{}');
      
      if (Array.isArray(data.selected_company)) {
        setCompanyFilter(data.selected_company.map((c: string) => ({ value: c, label: c })));
      }
      if (Array.isArray(data.selected_location)) {
        setLocationFilter(data.selected_location.map((l: string) => ({ value: l, label: l })));
      }
      if (Array.isArray(data.selected_period)) {
        setPeriodFilter(data.selected_period.map((p: string) => ({ value: p, label: p })));
      }
      if (Array.isArray(data.selected_financial_year)) {
        setFYearFilter(data.selected_financial_year.map((y: string) => ({ value: y, label: y })));
      }
      if (Array.isArray(data.selected_industry)) {
        setIndustryFilter(data.selected_industry.map((i: string) => ({ value: i, label: i })));
      }
      if (Array.isArray(data.company_list) && data.company_list.length > 0) {
        setCompanyList((prev) => Array.from(new Set([...prev, ...data.company_list])));
      }

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
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist step1 data to sessionStorage
  useEffect(() => {
    try {
      const selectedBotsObjects = table
        .getRowModel()
        .rows.filter((r) => Boolean(rowSelection[r.id]))
        .map((r) => r.original as any);

      const payload = {
        selected_company: companyFilter.map((opt) => opt.value),
        selected_location: locationFilter.map((opt) => opt.value),
        selected_period: periodFilter.map((opt) => opt.value),
        selected_financial_year: fYearFilter.map((opt) => opt.value),
        selected_industry: industryFilter.map((opt) => opt.value),
        selected_bots: selectedBotsObjects,
        company_list: companyList,
      };

      sessionStorage.setItem('step1', JSON.stringify(payload));
    } catch (e) {
      // ignore
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

  // Transform to react-select options
  const companyOptions: OptionType[] = companyList.map((c) => ({ value: c, label: c }));
  const locationOptions: OptionType[] = locations.map((loc) => ({ value: loc, label: loc }));
  const periodOptions_rs: OptionType[] = [
    ...new Set([...(bots as any).map((bot: any) => bot.period).filter(Boolean), ...periodOptions]),
  ].map((period: any) => ({ value: period, label: period }));
  const fYearOptions_rs: OptionType[] = [
    ...new Set([...(bots as any).map((bot: any) => bot.fYear).filter(Boolean), ...fYearOptions]),
  ].map((year: any) => ({ value: year, label: year }));
  const industryOptions_rs: OptionType[] = [
    ...new Set([
      ...(bots as any).map((bot: any) => bot.industry).filter(Boolean),
      ...industryOptions,
    ]),
  ].map((industry: any) => ({ value: industry, label: industry }));
  const categoryOptions_rs: OptionType[] = [
    { value: 'P2P', label: 'P2P' },
    { value: 'H2R', label: 'H2R' },
    { value: 'O2C', label: 'O2C' },
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '40px',
      borderRadius: '0.5rem',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      zIndex: 50,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(var(--secondary))',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--secondary-foreground))',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--secondary-foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      },
    }),
  };

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
            <Label htmlFor="company">
              Company
            </Label>
            <ReactSelect
              isMulti
              options={companyOptions}
              value={companyFilter}
              onChange={(selected) => {
                setCompanyFilter(selected as OptionType[]);
              }}
              placeholder="Select company"
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="location">Location</Label>
            <ReactSelect
              isMulti
              options={locationOptions}
              value={locationFilter}
              onChange={(selected) => setLocationFilter(selected as OptionType[])}
              placeholder="Select location"
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="period">Period</Label>
            <ReactSelect
              isMulti
              options={periodOptions_rs}
              value={periodFilter}
              onChange={(selected) => setPeriodFilter(selected as OptionType[])}
              placeholder="Select period"
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="financial-year">Financial Year</Label>
            <ReactSelect
              isMulti
              options={fYearOptions_rs}
              value={fYearFilter}
              onChange={(selected) => setFYearFilter(selected as OptionType[])}
              placeholder="Select financial year"
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="industry">Industry</Label>
            <ReactSelect
              isMulti
              options={industryOptions_rs}
              value={industryFilter}
              onChange={(selected) => setIndustryFilter(selected as OptionType[])}
              placeholder="Select industry"
              styles={customStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      {/* Select Bots Section */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex justify-between">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">Select Procedures</h2>
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
          {/* Category Filter and Reset */}
          <div className="w-1/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block w-32">
                <ReactSelect
                  isMulti
                  options={categoryOptions_rs}
                  value={categoryFilterValue}
                  onChange={(selected) => {
                    const values = selected as OptionType[];
                    setCategoryFilterValue(values);
                    try {
                      const col = table.getColumn('category');
                      if (col) {
                        col.setFilterValue(
                          values.length > 0 ? values.map((v) => v.value) : undefined
                        );
                      }
                    } catch (e) {
                      // ignore
                    }
                  }}
                  placeholder="Category"
                  styles={customStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
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