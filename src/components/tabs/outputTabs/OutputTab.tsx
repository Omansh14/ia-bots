import { Download } from 'lucide-react';
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
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

const vendorData = [
  {
    id: 0,
    vendorId: 'VX801',
    vendorName: 'Vendor 1',
    gstNo: '27ABCDE000625',
    panNo: 'None',
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
    gstNo: 'None',
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
    panNo: 'None',
    bankAccount: 'AC794777',
    ifsc: 'AC794777',
    lastTransactionId: 'LT-1003',
    creatorId: 'Emp_8',
    exceptionNoted: ['PAN No. missing'],
    active: 'Active',
    updateDate: '2024-04-26',
  },
];

const anomalies = [
  { id: 0, creator: 'Emp_A', count: 2 },
  { id: 1, creator: 'Emp_5', count: 1 },
  { id: 2, creator: 'Emp_8', count: 1 },
];

const poMatches = [
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

  // Define columns for PO-GRN-Invoice Match table (no sorting / no pagination)
  type PoMatch = (typeof poMatches)[number];

  const columns: ColumnDef<PoMatch>[] = [
    { accessorKey: 'id', header: '', cell: ({ row }) => <span className="text-muted-foreground">{Number(row.getValue('id')) + 1}</span>, enableSorting: false },
    { accessorKey: 'poNo', header: 'PO_No', cell: ({ row }) => <div className="font-medium">{row.getValue('poNo')}</div> },
    { accessorKey: 'exceptionQty', header: 'Exception Noted (Qty)', cell: ({ row }) => <div>{row.getValue('exceptionQty')}</div> },
    { accessorKey: 'exceptionAmt', header: 'Exception Noted (Amt)', cell: ({ row }) => <div>{row.getValue('exceptionAmt')}</div> },
    { accessorKey: 'financialImpact', header: 'Financial Impact', cell: ({ row }) => <div className={Number(row.getValue('financialImpact')) < 0 ? 'text-destructive' : ''}>{String(row.getValue('financialImpact'))}</div> },
    { accessorKey: 'poQty_PO', header: 'PO_Qty_PO', cell: ({ row }) => <div>{String(row.getValue('poQty_PO'))}</div> },
    { accessorKey: 'poAmt_PO', header: 'PO_Amt_PO', cell: ({ row }) => <div>{String(row.getValue('poAmt_PO'))}</div> },
    { accessorKey: 'grnQtySum', header: 'GRN_Qty_Sum', cell: ({ row }) => <div>{String(row.getValue('grnQtySum'))}</div> },
    { accessorKey: 'invoiceQtySum', header: 'Invoice_Qty_Sum', cell: ({ row }) => <div>{String(row.getValue('invoiceQtySum'))}</div> },
    { accessorKey: 'invoiceAmount', header: 'Invoice_Amount', cell: ({ row }) => <div>{String(row.getValue('invoiceAmount'))}</div> },
  ];

  const table = useReactTable({
    data: poMatches,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          <Card className="w-1/2 bg-gray-100 border border-gray-200">
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl font-bold text-foreground">12/24</span>
              <span className="text-sm text-muted-foreground font-normal">Total Exceptions Identified</span>
            </div>
          </Card>
          <Card className="w-1/2 bg-gray-100 border border-gray-200">
            <div className="flex items-center justify-center gap-4">
              <div className="text-2xl font-bold text-foreground">12%</div>
              <div className="text-sm text-muted-foreground font-normal">Exception Rate (%)</div>
            </div>
          </Card>
        </div>

        {/* hide horizontal scrollbar while preserving scrolling */}
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none} .hide-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}</style>
        <div className="overflow-x-auto hide-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-16 px-4 py-2"></TableHead>
                <TableHead className="px-4 py-2">Vendor_ID</TableHead>
                <TableHead className="px-4 py-2">Vendor_Name</TableHead>
                <TableHead className="px-4 py-2">GST_No.</TableHead>
                <TableHead className="px-4 py-2">PAN_No.</TableHead>
                <TableHead className="px-4 py-2">Bank Account</TableHead>
                <TableHead className="px-4 py-2">IFSC</TableHead>
                <TableHead className="px-4 py-2">Updation_Date</TableHead>
                <TableHead className="px-4 py-2">Active Status</TableHead>
                <TableHead className="px-4 py-2">Last Transaction ID</TableHead>
                <TableHead className="px-4 py-2">Creater_ID</TableHead>
                <TableHead className="px-4 py-2">Exception Noted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorData.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="text-muted-foreground px-4 py-2">{vendor.id + 1}</TableCell>
                  <TableCell className="font-medium px-4 py-2">
                    {renderCell(vendor.vendorId)}
                  </TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.vendorName)}</TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.gstNo)}</TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.panNo)}</TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.bankAccount)}</TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.ifsc)}</TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.updateDate)}</TableCell>

                  <TableCell className="px-4 py-2">
                    <Badge variant={vendor.active === 'Active' ? 'success' : 'destructive'}>
                      {vendor.active}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {renderCell(vendor.lastTransactionId)}
                  </TableCell>
                  <TableCell className="px-4 py-2">{renderCell(vendor.creatorId)}</TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex gap-2">
                      {vendor.exceptionNoted?.map((ex, idx) => (
                        <span
                          key={idx}
                          className={
                            String(ex) === 'None' ? 'text-muted-foreground' : 'text-foreground'
                          }
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">
          <span className="text-primary">Anomalies by Creator</span>
          <span className="mx-2">|</span>
          <span>Missing Vendors × Duplicate Invoices</span>
        </h4>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-16 px-4 py-2"></TableHead>
              <TableHead className="px-4 py-2">Creator_ID</TableHead>
              <TableHead className="px-4 py-2">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anomalies.map((anomaly) => (
              <TableRow key={anomaly.id}>
                <TableCell className="text-muted-foreground px-4 py-2">{anomaly.id}</TableCell>
                <TableCell className="px-4 py-2">{anomaly.creator}</TableCell>
                <TableCell className="px-4 py-2">{anomaly.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">P2P — PO-GRN-Invoice Match</h4>
        <div>
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
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
                  <TableCell colSpan={10} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination removed — table renders all rows via TanStack core row model */}
        </div>
      </div>
    </div>
  );
};
