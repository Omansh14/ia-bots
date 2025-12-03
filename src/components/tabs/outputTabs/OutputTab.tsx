import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Type definitions
interface VendorData {
  id: number;
  vendorId: string;
  vendorName: string;
  gstNo: string | null;
  panNo: string | null;
  bankAccount: string;
  ifsc: string;
  lastTransactionId: string;
  creatorId: string;
  exceptionNoted: string[];
  active: 'Active' | 'Inactive';
  updateDate: string;
}

interface Anomaly {
  id: number;
  creator: string;
  count: number;
}

interface PoMatch {
  id: number;
  poNo: string;
  exceptionQty: string;
  exceptionAmt: string;
  financialImpact: number;
  poQty_PO: number;
  poAmt_PO: number;
  grnQtySum: number;
  invoiceQtySum: number;
  invoiceAmount: number;
}

const vendorData: VendorData[] = [
  {
    id: 0,
    vendorId: 'VX801',
    vendorName: 'Vendor 1',
    gstNo: '27ABCDE000625',
    panNo: null,
    bankAccount: 'AC196847',
    ifsc: 'IFSC000005',
    lastTransactionId: 'LT-1001',
    creatorId: 'Emp_A',
    exceptionNoted: ['PAN No. missing'],
    active: 'Active',
    updateDate: '2024-04-28',
  },
  {
    id: 1,
    vendorId: 'VX802',
    vendorName: 'Vendor 2',
    gstNo: null,
    panNo: 'ABCDE0009F',
    bankAccount: 'AC794777',
    ifsc: 'AC794777',
    lastTransactionId: 'LT-1002',
    creatorId: 'Emp_5',
    exceptionNoted: ['GST missing'],
    active: 'Inactive',
    updateDate: '2024-04-26',
  },
  {
    id: 2,
    vendorId: 'VX803',
    vendorName: 'Vendor 3',
    gstNo: '27ABCDE000625',
    panNo: null,
    bankAccount: 'AC794777',
    ifsc: 'AC794777',
    lastTransactionId: 'LT-1003',
    creatorId: 'Emp_8',
    exceptionNoted: ['PAN No. missing'],
    active: 'Active',
    updateDate: '2024-04-26',
  },
];

const anomalies: Anomaly[] = [
  { id: 0, creator: 'Emp_A', count: 2 },
  { id: 1, creator: 'Emp_5', count: 1 },
  { id: 2, creator: 'Emp_8', count: 1 },
];

const poMatches: PoMatch[] = [
  {
    id: 0,
    poNo: 'PO1448',
    exceptionQty: 'None',
    exceptionAmt: 'Amount Mismatch',
    financialImpact: -5000,
    poQty_PO: 100,
    poAmt_PO: 37100,
    grnQtySum: 100,
    invoiceQtySum: 100,
    invoiceAmount: 37100,
  },
  {
    id: 1,
    poNo: 'PO4336',
    exceptionQty: 'Quantity Mismatch',
    exceptionAmt: 'Amount Mismatch',
    financialImpact: 588,
    poQty_PO: 38,
    poAmt_PO: 7448,
    grnQtySum: 35,
    invoiceQtySum: 35,
    invoiceAmount: 7448,
  },
  {
    id: 2,
    poNo: 'PO2478',
    exceptionQty: 'None',
    exceptionAmt: 'Amount Mismatch',
    financialImpact: 1540,
    poQty_PO: 77,
    poAmt_PO: 10626,
    grnQtySum: 77,
    invoiceQtySum: 77,
    invoiceAmount: 10626,
  },
  {
    id: 3,
    poNo: 'PO8888',
    exceptionQty: 'None',
    exceptionAmt: 'Amount Mismatch',
    financialImpact: -550,
    poQty_PO: 11,
    poAmt_PO: 4752,
    grnQtySum: 11,
    invoiceQtySum: 11,
    invoiceAmount: 4752,
  },
  {
    id: 4,
    poNo: 'PO6907',
    exceptionQty: 'None',
    exceptionAmt: 'Amount Mismatch',
    financialImpact: -2000,
    poQty_PO: 40,
    poAmt_PO: 9200,
    grnQtySum: 40,
    invoiceQtySum: 40,
    invoiceAmount: 9200,
  },
];

export const OutputTab = () => {
  const renderCell = (val: any) => {
    if (val === null || val === undefined) val = 'None';
    const isNone = String(val) === 'None';
    return <span className={isNone ? 'text-muted-foreground' : 'text-foreground'}>{val}</span>;
  };

  // Vendor KYC Table Columns
  const vendorColumns: ColumnDef<VendorData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{(row.getValue('id') as number) + 1}</div>
      ),
    },
    {
      accessorKey: 'vendorId',
      header: 'Vendor_ID',
      cell: ({ row }) => <div className="font-medium">{row.getValue('vendorId')}</div>,
    },
    {
      accessorKey: 'vendorName',
      header: 'Vendor_Name',
      cell: ({ row }) => <div>{renderCell(row.getValue('vendorName'))}</div>,
    },
    {
      accessorKey: 'gstNo',
      header: 'GST_No.',
      cell: ({ row }) => <div>{renderCell(row.getValue('gstNo'))}</div>,
    },
    {
      accessorKey: 'panNo',
      header: 'PAN_No.',
      cell: ({ row }) => <div>{renderCell(row.getValue('panNo'))}</div>,
    },
    {
      accessorKey: 'bankAccount',
      header: 'Bank Account',
      cell: ({ row }) => <div>{renderCell(row.getValue('bankAccount'))}</div>,
    },
    {
      accessorKey: 'ifsc',
      header: 'IFSC',
      cell: ({ row }) => <div>{renderCell(row.getValue('ifsc'))}</div>,
    },
    {
      accessorKey: 'updateDate',
      header: 'Updation_Date',
      cell: ({ row }) => <div>{renderCell(row.getValue('updateDate'))}</div>,
    },
    {
      accessorKey: 'active',
      header: 'Active Status',
      cell: ({ row }) => {
        const status = row.getValue('active') as 'Active' | 'Inactive';
        return <Badge variant={status === 'Active' ? 'success' : 'destructive'}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'lastTransactionId',
      header: 'Last Transaction ID',
      cell: ({ row }) => <div>{renderCell(row.getValue('lastTransactionId'))}</div>,
    },
    {
      accessorKey: 'creatorId',
      header: 'Creater_ID',
      cell: ({ row }) => <div>{renderCell(row.getValue('creatorId'))}</div>,
    },
    {
      accessorKey: 'exceptionNoted',
      header: 'Exception Noted',
      cell: ({ row }) => {
        const exceptions = row.getValue('exceptionNoted') as string[];
        return (
          <div className="flex gap-2">
            {exceptions.map((ex, idx) => (
              <span
                key={idx}
                className={ex === 'None' ? 'text-muted-foreground' : 'text-foreground'}
              >
                {ex}
              </span>
            ))}
          </div>
        );
      },
    },
  ];

  // Anomalies Table Columns
  const anomalyColumns: ColumnDef<Anomaly>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{Number(row.getValue('id')) + 1}</div>
      ),
    },
    {
      accessorKey: 'creator',
      header: 'Creator_ID',
      cell: ({ row }) => <div>{row.getValue('creator')}</div>,
    },
    {
      accessorKey: 'count',
      header: 'Count',
      cell: ({ row }) => <div>{row.getValue('count')}</div>,
    },
  ];

  // PO Match Table Columns
  const poMatchColumns: ColumnDef<PoMatch>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{(row.getValue('id') as number) + 1}</div>
      ),
    },
    {
      accessorKey: 'poNo',
      header: 'PO_No',
      cell: ({ row }) => <div className="font-medium">{row.getValue('poNo')}</div>,
    },
    {
      accessorKey: 'exceptionQty',
      header: 'Exception Noted (Qty)',
      cell: ({ row }) => <div>{row.getValue('exceptionQty')}</div>,
    },
    {
      accessorKey: 'exceptionAmt',
      header: 'Exception Noted (Amt)',
      cell: ({ row }) => <div>{row.getValue('exceptionAmt')}</div>,
    },
    {
      accessorKey: 'financialImpact',
      header: 'Financial Impact',
      cell: ({ row }) => {
        const value = row.getValue('financialImpact') as number;
        return <div className={value < 0 ? 'text-destructive' : 'text-foreground'}>{value}</div>;
      },
    },
    {
      accessorKey: 'poQty_PO',
      header: 'PO_Qty_PO',
      cell: ({ row }) => <div>{row.getValue('poQty_PO')}</div>,
    },
    {
      accessorKey: 'poAmt_PO',
      header: 'PO_Amt_PO',
      cell: ({ row }) => <div>{row.getValue('poAmt_PO')}</div>,
    },
    {
      accessorKey: 'grnQtySum',
      header: 'GRN_Qty_Sum',
      cell: ({ row }) => <div>{row.getValue('grnQtySum')}</div>,
    },
    {
      accessorKey: 'invoiceQtySum',
      header: 'Invoice_Qty_Sum',
      cell: ({ row }) => <div>{row.getValue('invoiceQtySum')}</div>,
    },
    {
      accessorKey: 'invoiceAmount',
      header: 'Invoice_Amount',
      cell: ({ row }) => <div>{row.getValue('invoiceAmount')}</div>,
    },
  ];

  // Create table instances
  const vendorTable = useReactTable({
    data: vendorData,
    columns: vendorColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const anomalyTable = useReactTable({
    data: anomalies,
    columns: anomalyColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const poMatchTable = useReactTable({
    data: poMatches,
    columns: poMatchColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">P2P — Validate Vendor KYC</h3>
            <p className="text-sm text-muted-foreground">
              AI validates vendor KYC data, ensuring AML compliance.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <div className="p-4 flex gap-4 w-full">
          <Card className="w-1/2 bg-gray-100 border border-gray-200 p-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl font-bold text-foreground">12/24</span>
              <span className="text-sm text-muted-foreground font-normal">
                Total Exceptions Identified
              </span>
            </div>
          </Card>
          <Card className="w-1/2 bg-gray-100 border border-gray-200 p-4">
            <div className="flex items-center justify-center gap-4">
              <div className="text-2xl font-bold text-foreground">12%</div>
              <div className="text-sm text-muted-foreground font-normal">Exception Rate (%)</div>
            </div>
          </Card>
        </div>

        <style>
          {`.hide-scrollbar::-webkit-scrollbar{display:none} .hide-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}
        </style>
        <div className="overflow-x-auto hide-scrollbar">
          <Table>
            <TableHeader>
              {vendorTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {vendorTable.getRowModel().rows?.length ? (
                vendorTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={vendorColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => vendorTable.previousPage()}
                disabled={!vendorTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => vendorTable.nextPage()}
                disabled={!vendorTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>

            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${vendorTable.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      vendorTable.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={vendorTable.getState().pagination.pageSize} />
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
                  Page {vendorTable.getState().pagination.pageIndex + 1} of{' '}
                  {vendorTable.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => vendorTable.previousPage()}
                    disabled={!vendorTable.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => vendorTable.nextPage()}
                    disabled={!vendorTable.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="anomalies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="anomalies">Anomalies by Creator</TabsTrigger>
          <TabsTrigger value="missing-vendor">Missing Vendor × Duplicate Invoices</TabsTrigger>
          <TabsTrigger value="ai-report">AI Report</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="mt-4">
          <Table>
            <TableHeader>
              {anomalyTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {anomalyTable.getRowModel().rows?.length ? (
                anomalyTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={anomalyColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => anomalyTable.previousPage()}
                disabled={!anomalyTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => anomalyTable.nextPage()}
                disabled={!anomalyTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>

            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${anomalyTable.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      anomalyTable.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={anomalyTable.getState().pagination.pageSize} />
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
                  Page {anomalyTable.getState().pagination.pageIndex + 1} of{' '}
                  {anomalyTable.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => anomalyTable.previousPage()}
                    disabled={!anomalyTable.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => anomalyTable.nextPage()}
                    disabled={!anomalyTable.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="missing-vendor" className="mt-4">
          <Table>
            <TableHeader>
              {anomalyTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {anomalyTable.getRowModel().rows?.length ? (
                anomalyTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={anomalyColumns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => anomalyTable.previousPage()}
                disabled={!anomalyTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => anomalyTable.nextPage()}
                disabled={!anomalyTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>

            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${anomalyTable.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      anomalyTable.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={anomalyTable.getState().pagination.pageSize} />
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
                  Page {anomalyTable.getState().pagination.pageIndex + 1} of{' '}
                  {anomalyTable.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => anomalyTable.previousPage()}
                    disabled={!anomalyTable.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => anomalyTable.nextPage()}
                    disabled={!anomalyTable.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-report" className="mt-4 max-h-60 overflow-y-auto">
          <div className="border rounded-lg p-6 bg-white">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">AI-Generated Analysis Report</h2>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of procurement anomalies and recommendations
                </p>
              </div>

              <div className="space-y-6">
                {/* Observation */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">Observation:</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm leading-relaxed ml-2">
                    <li>
                      There are numerous instances of quantity and amount mismatches between
                      Purchase Orders (PO), Goods Received Note (GRN), and Invoices. For instance,
                      PO7734 shows a quantity mismatch of 2 units and an amount mismatch of ₹794,
                      indicating discrepancies in the procurement process.
                    </li>
                    <li>
                      Several vendors have multiple exceptions noted against them, such as Vendor_1
                      with 3 exceptions and Vendor_3 with 4 exceptions. This could indicate issues
                      with specific vendor performance or compliance.
                    </li>
                    <li>
                      A number of Purchase Orders (POs) are showing a negative financial impact,
                      indicating overpayment or over-receipt of goods. For instance, PO1448 shows a
                      financial impact of -₹5000, suggesting an overpayment of this amount.
                    </li>
                    <li>
                      The data shows a significant variation in the payment terms, ranging from 30
                      to 60 days. This could lead to cash flow issues if not managed properly.
                    </li>
                  </ul>
                </div>

                {/* Risk */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-700">
                    Risk (with root cause & consequence):
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm leading-relaxed ml-2">
                    <li>
                      The root cause of the quantity and amount mismatches could be due to errors in
                      the procurement process, poor vendor performance, or lack of effective
                      controls. This could lead to financial losses, overpayment, or receipt of
                      incorrect quantities.
                    </li>
                    <li>
                      The multiple exceptions noted against specific vendors could be due to poor
                      vendor performance or lack of compliance, leading to increased risk of
                      financial loss and potential reputational damage.
                    </li>
                    <li>
                      The negative financial impact observed in several POs could be due to
                      overpayment or over-receipt of goods, leading to potential financial losses.
                    </li>
                    <li>
                      The variation in payment terms could lead to cash flow issues, impacting the
                      company's ability to meet its financial obligations.
                    </li>
                  </ul>
                </div>

                {/* Recommendation */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-700">
                    Recommendation for Improvement (specific, actionable):
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm leading-relaxed ml-2">
                    <li>
                      Implement stringent controls in the procurement process to prevent quantity
                      and amount mismatches. This could include regular audits and cross-checking of
                      POs, GRNs, and Invoices.
                    </li>
                    <li>
                      Regularly review vendor performance and compliance to identify and address
                      issues promptly. This could involve regular vendor audits and performance
                      reviews.
                    </li>
                    <li>
                      Establish robust financial controls to prevent overpayment or over-receipt of
                      goods. This could include regular financial audits and stringent approval
                      processes for payments.
                    </li>
                    <li>
                      Standardize payment terms across vendors to manage cash flow effectively. This
                      could involve renegotiating contracts or implementing a standard payment term
                      policy.
                    </li>
                  </ul>
                </div>

                {/* Risk Category */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-700">
                    Risk Category with Rationale:
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-sm leading-relaxed ml-2">
                    <li>
                      <span className="font-medium">Operational Risk:</span> The quantity and amount
                      mismatches, negative financial impact, and variation in payment terms all
                      point to potential operational issues in the procurement process.
                    </li>
                    <li>
                      <span className="font-medium">Financial Risk:</span> The negative financial
                      impact observed in several POs and the variation in payment terms could lead
                      to financial losses or cash flow issues.
                    </li>
                    <li>
                      <span className="font-medium">Compliance Risk:</span> The multiple exceptions
                      noted against specific vendors could indicate non-compliance with procurement
                      policies or regulations.
                    </li>
                  </ul>
                </div>

                {/* Top 3 Critical Anomalies */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-700">
                    Top 3 Critical Anomalies:
                  </h3>
                  <ol className="space-y-3 list-decimal list-inside text-sm leading-relaxed ml-2">
                    <li>
                      <span className="font-medium">Quantity and Amount Mismatches:</span> These are
                      prevalent across multiple POs and vendors, indicating a systemic issue that
                      could lead to significant financial losses.
                    </li>
                    <li>
                      <span className="font-medium">Negative Financial Impact:</span> Several POs
                      show a negative financial impact, suggesting potential overpayment or
                      over-receipt of goods. This could lead to financial losses if not addressed
                      promptly.
                    </li>
                    <li>
                      <span className="font-medium">Variation in Payment Terms:</span> The
                      significant variation in payment terms could lead to cash flow issues,
                      impacting the company's ability to meet its financial obligations.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">P2P — PO-GRN-Invoice Match</h4>
        <Table>
          <TableHeader>
            {poMatchTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {poMatchTable.getRowModel().rows?.length ? (
              poMatchTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={poMatchColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => poMatchTable.previousPage()}
              disabled={!poMatchTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => poMatchTable.nextPage()}
              disabled={!poMatchTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${poMatchTable.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    poMatchTable.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={poMatchTable.getState().pagination.pageSize} />
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
                Page {poMatchTable.getState().pagination.pageIndex + 1} of{' '}
                {poMatchTable.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => poMatchTable.previousPage()}
                  disabled={!poMatchTable.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => poMatchTable.nextPage()}
                  disabled={!poMatchTable.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
