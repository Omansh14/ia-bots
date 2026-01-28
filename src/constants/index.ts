import type { Client, Bot, AuditProcedure, AuditData } from '@/types/index.types';
import type { UploadedFile } from '@/components/modals/DataExtractionModal';

const Clients: Client[] = [
  {
    client_id: 'C-1001',
    name: 'Tata Motors',
    industry: 'Automobile',
    timestamp: new Date(),
    lastrun: new Date('2024-10-01T10:20:30Z'),
    audit_procedures: 14,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1002',
    name: 'Tech Innovators',
    industry: 'Technology',
    lastrun: new Date('2024-10-01T10:20:30Z'),

    timestamp: new Date(),
    audit_procedures: 25,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1003',
    name: 'Global Foods',
    industry: 'Manufacturing',
    timestamp: new Date(),
    lastrun: new Date('2024-10-01T10:20:30Z'),

    audit_procedures: 10,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1004',
    name: 'EcoBuild',
    industry: 'Manufacturing',
    lastrun: new Date('2024-10-01T10:20:30Z'),

    timestamp: new Date(),
    audit_procedures: 16,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1005',
    name: 'Finserve Solutions',
    industry: 'Technology',
    lastrun: new Date('2024-10-01T10:20:30Z'),

    timestamp: new Date(),
    audit_procedures: 20,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1006',
    name: 'Greenwave Energy',
    industry: 'Energy',
    lastrun: new Date('2024-10-01T10:20:30Z'),

    timestamp: new Date(),
    audit_procedures: 8,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1007',
    name: 'Apex Pharmaceuticals',
    industry: 'Healthcare',
    lastrun: new Date('2024-10-01T10:20:30Z'),

    timestamp: new Date(),
    audit_procedures: 18,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1008',
    name: 'Urban Retail Co.',
    lastrun: new Date('2024-10-01T10:20:30Z'),

    industry: 'Retail',
    timestamp: new Date(),
    audit_procedures: 12,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1009',
    name: 'Orbit Logistics',
    industry: 'Transportation',
    timestamp: new Date(),
    lastrun: new Date('2024-10-01T10:20:30Z'),

    audit_procedures: 22,
    action: ['share', 'delete'],
  },
];

const bots: Bot[] = [
  {
    id: '1',
    category: 'P2P',
    auditProcedure: 'Validate Vendor KYC',
    description:
      'Validates vendor master data for missing or invalid KYC fields such as PAN, GST, or bank account details.',
    dataUsed: ['Vendor Master'],
  },
  {
    id: '2',
    category: 'P2P',
    auditProcedure: 'PO-GRN-Invoice Match',
    description:
      'Validate that invoices are matched against approved purchase orders and corresponding GRNs to ensure 3-way matching.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '3',
    category: 'P2P',
    auditProcedure: 'Post-Invoice POs',
    description:
      'Flags purchase orders created after the corresponding invoice date, indicating potential control bypass.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '4',
    category: 'P2P',
    auditProcedure: 'Split Orders',
    description:
      'Analyzes procurement transactions to detect multiple small POs created for the same vendor to bypass approval thresholds.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '5',
    category: 'P2P',
    auditProcedure: 'Duplicate Vendors',
    description:
      'Detects and prevents creation of duplicate vendor records by matching key identifiers like PAN, GST, and bank account.',
    dataUsed: ['Vendor Master'],
  },
  {
    id: '6',
    category: 'P2P',
    auditProcedure: 'Unauthorized Vendor Bank Change',
    description:
      'Monitors vendor master data updates to detect suspicious or unauthorized bank account changes.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '7',
    category: 'P2P',
    auditProcedure: 'Validate Vendor GST',
    description:
      'Validates vendor GST number format and correctness based on standard GSTIN validation rules.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '8',
    category: 'P2P',
    auditProcedure: 'PO Approval Bypass',
    description:
      'Identifies purchase orders created without passing through the designated approval workflow.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '9',
    category: 'P2P',
    auditProcedure: 'Price Variance Analysis',
    description:
      'Compares PO item prices with historical prices for the same item or vendor to detect unusual rate changes.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '10',
    category: 'P2P',
    auditProcedure: 'Excessive Emergency Purchases',
    description:
      "Counts purchase orders marked as 'urgent' or 'emergency' to identify potential misuse of emergency purchase controls.",
    dataUsed: ['Vendor Master'],
  },
  {
    id: '11',
    category: 'P2P',
    auditProcedure: 'Vendor Concentration Risk',
    description:
      'Calculates spend concentration per vendor to highlight over-dependence on a few vendors.',
    dataUsed: ['Vendor Master'],
  },
  {
    id: '12',
    category: 'P2P',
    auditProcedure: 'GRN Delay Tracking',
    description:
      'Tracks delays between goods delivery date and GRN posting date to detect process inefficiencies.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '13',
    category: 'P2P',
    auditProcedure: 'Unmatched GRNs',
    description:
      'Identifies GRNs that remain unmatched with invoices beyond a specified number of days.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '14',
    category: 'P2P',
    auditProcedure: 'Over-receipt',
    description:
      'Flags GRNs where received quantity exceeds PO quantity, indicating possible over-receipt issues.',
    dataUsed: ['P2P Sample', 'Vendor Master'],
  },
  {
    id: '15',
    category: 'P2P',
    auditProcedure: 'Payment Term Adherence',
    description: 'Analyzes vendor payment timelines against agreed payment terms.',
    dataUsed: ['P2P Sample'],
  },
  {
    id: '16',
    category: 'P2P',
    auditProcedure: 'Duplicate Invoice Detection',
    description:
      'Detects duplicate invoices by comparing vendor, invoice date, and invoice amount combinations.',
    dataUsed: ['O2C Sample'],
  },
  {
    id: '17',
    category: 'P2P',
    auditProcedure: 'Invoice to Inactive Vendor',
    description: 'Identifies invoices issued to vendors whose status is inactive or blocked.',
    dataUsed: ['O2C Sample'],
  },
  {
    id: '18',
    category: 'P2P',
    auditProcedure: 'Non-PO Invoices',
    description: 'Flags invoices that do not reference any purchase order.',
    dataUsed: ['Customer Master'],
  },
  {
    id: '19',
    category: 'P2P',
    auditProcedure: 'Foreign Currency Mismatch',
    description:
      'Identifies invoices where the currency does not match the associated purchase order currency.',
    dataUsed: ['O2C Sample'],
  },
  {
    id: '20',
    category: 'P2P',
    auditProcedure: 'Round Sum Invoices',
    description: 'Flags invoices with unusually rounded values such as exact multiples of 1,000.',
    dataUsed: ['O2C Sample'],
  },
  {
    id: '21',
    category: 'O2C',
    auditProcedure: 'Credit Limit Breach',
    description:
      'Identifies customers whose outstanding receivables and open sales orders exceed their credit limits.',
    dataUsed: ['O2C Sample'],
  },
  {
    id: '22',
    category: 'O2C',
    auditProcedure: 'Duplicate Invoices',
    description:
      'Detects duplicate sales invoices using combinations like customer, date, and invoice amount.',
    dataUsed: ['O2C Sample'],
  },
  {
    id: '23',
    category: 'H2R',
    auditProcedure: 'Ghost Employee Detection',
    description: 'Detects employees receiving payroll but having no attendance records.',
    dataUsed: ['Employee Master'],
  },
  {
    id: '24',
    category: 'H2R',
    auditProcedure: 'Duplicate Employees',
    description:
      'Matches PAN, bank account, or other identifiers to detect duplicate employee records.',
    dataUsed: ['Employee Master', 'Attendance Register'],
  },
  {
    id: '25',
    category: 'H2R',
    auditProcedure: 'Inactive Employees in Payroll',
    description: 'Identifies employees still appearing in payroll after their recorded exit date.',
    dataUsed: ['Employee Master', 'Attendance Register'],
  },

  // IDs 26–35: No data provided → empty arrays
  {
    id: '26',
    category: 'O2C',
    auditProcedure: 'Zero-Priced Invoices',
    description: 'Identifies invoices with zero total value.',
    dataUsed: [],
  },
  {
    id: '27',
    category: 'O2C',
    auditProcedure: 'Missing Customer Master Data',
    description: 'Flags customer master records missing key fields like GST, PAN, or credit terms.',
    dataUsed: [],
  },
  {
    id: '28',
    category: 'O2C',
    auditProcedure: 'Overdue Delivery',
    description: 'Compares sales order date with delivery date to flag delayed deliveries.',
    dataUsed: [],
  },
  {
    id: '29',
    category: 'O2C',
    auditProcedure: 'Dispatch Without Invoice',
    description:
      'Identifies dispatch records where goods have been shipped but no invoice has been generated.',
    dataUsed: [],
  },
  {
    id: '30',
    category: 'O2C',
    auditProcedure: 'Excessive Small-Value Sales',
    description: 'Identifies repeated small-value transactions below a threshold.',
    dataUsed: [],
  },
  {
    id: '31',
    category: 'H2R',
    auditProcedure: 'Ghost Employee Detection',
    description: 'Detects employees receiving payroll but having no attendance records.',
    dataUsed: [],
  },
  {
    id: '32',
    category: 'H2R',
    auditProcedure: 'Duplicate Employees',
    description:
      'Matches PAN, bank account, or other identifiers to detect duplicate employee records.',
    dataUsed: [],
  },
  {
    id: '33',
    category: 'H2R',
    auditProcedure: 'Inactive Employees in Payroll',
    description: 'Identifies employees still appearing in payroll after their recorded exit date.',
    dataUsed: [],
  },
  {
    id: '34',
    category: 'H2R',
    auditProcedure: 'Statutory Compliance – PF',
    description: 'Checks PF deposit date against statutory due dates.',
    dataUsed: [],
  },
  {
    id: '35',
    category: 'H2R',
    auditProcedure: 'Statutory Compliance – ESI',
    description: 'Checks ESI deposit date against statutory due dates.',
    dataUsed: [],
  },
];

const audit_Procedures: AuditProcedure[] = [
  {
    id: '1',
    category: 'P2P',
    name: 'Prevent duplicate vendors',
    description: 'Detects and prevents creation of duplicate...',
    document: 'PAN certificate',
  },
  {
    id: '2',
    category: 'H2R',
    name: 'Ghost employee detection',
    description: 'Compares payroll records with attendance...',
    document: 'Invoice',
  },
  {
    id: '3',
    category: 'P2P',
    name: 'Ensure PO–GRN–Invoice match',
    description: 'Performs automated 3-way matching bet...',
    document: 'Invoice',
  },
  {
    id: '4',
    category: 'H2R',
    name: 'Unauthorized salary changes',
    description: 'Monitors and logs modifications in payroll...',
    document: 'Quotations',
  },
  {
    id: '5',
    category: 'P2P',
    name: 'Detect post-invoice POs',
    description: 'Flags purchase orders created after the c...',
    document: 'GST Certificate',
  },
];

export const auditData: AuditData[] = [
  {
    jobId: '10102025-001',
    location: 'Mumbai',
    approvedProcedures: 80,
    totalProcedures: 112,
    exceptions: 167,
    runtime: '30 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Completed',
  },
  {
    jobId: '20240315-004',
    location: 'Bengaluru',
    approvedProcedures: 131,
    totalProcedures: 187,
    exceptions: 213,
    runtime: '45 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Draft',
  },
  {
    jobId: '20240315-008',
    location: 'Chennai',
    approvedProcedures: 104,
    totalProcedures: 145,
    exceptions: 154,
    runtime: '25 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Completed',
  },
  {
    jobId: '20240315-007',
    location: 'Kolkata',
    approvedProcedures: 114,
    totalProcedures: 163,
    exceptions: 189,
    runtime: '40 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'In Progress',
  },
  {
    jobId: '20240315-006',
    location: 'Hyderabad',
    approvedProcedures: 106,
    totalProcedures: 152,
    exceptions: 172,
    runtime: '35 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Failed',
  },
  {
    jobId: '20240315-003',
    location: 'Pune',
    approvedProcedures: 139,
    totalProcedures: 198,
    exceptions: 234,
    runtime: '50 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Completed',
  },
  {
    jobId: '20240315-002',
    location: 'Ahmedabad',
    approvedProcedures: 73,
    totalProcedures: 105,
    exceptions: 87,
    runtime: '20 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Draft',
  },
  {
    jobId: '20240315-008',
    location: 'Surat',
    approvedProcedures: 123,
    totalProcedures: 176,
    exceptions: 195,
    runtime: '42 seconds',
    createdOn: new Date('2024-10-01T10:20:30Z'),
    status: 'Failed',
  },
];

const files: UploadedFile[] = [
  {
    id: '1',
    name: 'audit_data_2024.csv',
    type: 'csv',
    isMapped: false,
    content:
      'Company,Revenue,Year\nAcme Corp,5000000,2024\nTech Inc,3500000,2024\nGlobal Ltd,7200000,2024',
  },
  {
    id: '2',
    name: 'financial_report.xlsx',
    type: 'xlsx',
    isMapped: true,
    content:
      '{"sheets": [{"name": "Summary", "data": [["Total Assets", "$50,000,000"], ["Liabilities", "$15,000,000"], ["Equity", "$35,000,000"]]}]}',
  },
  {
    id: '3',
    name: 'client_details.csv',
    type: 'csv',
    isMapped: true,
    content:
      'Client ID,Client Name,Email,Industry\n1,Acme Corporation,contact@acme.com,Technology\n2,Tech Innovations,info@techinnovations.com,Software',
  },
  {
    id: '4',
    name: 'expense_report_jan.xlsx',
    type: 'xlsx',
    isMapped: false,
    content:
      '{"sheets": [{"name": "Expenses", "data": [["Date", "Category", "Amount"], ["2024-01-05", "Travel", "1500"], ["2024-01-10", "Supplies", "250"]]}]}',
  },
  {
    id: '5',
    name: 'employee_data.xls',
    type: 'xls',
    isMapped: true,
    content:
      '{"sheets": [{"name": "Employees", "data": [["Employee ID", "Name", "Department"], ["E001", "John Smith", "HR"], ["E002", "Sarah Johnson", "Finance"]]}]}',
  },
  {
    id: '6',
    name: 'inventory_stock.csv',
    type: 'csv',
    isMapped: false,
    content:
      'SKU,Product,Quantity,Location\n001,Widget A,500,Warehouse A\n002,Widget B,350,Warehouse B\n003,Gadget X,200,Warehouse A',
  },
  {
    id: '7',
    name: 'sales_metrics_q4.xlsx',
    type: 'xlsx',
    isMapped: true,
    content:
      '{"sheets": [{"name": "Sales", "data": [["Month", "Total Sales", "Units", "Target"], ["October", "450000", "125", "400000"], ["November", "520000", "145", "450000"]]}]}',
  },
  {
    id: '8',
    name: 'compliance_data.xls',
    type: 'xls',
    isMapped: true,
    content:
      '{"sheets": [{"name": "Checklist", "data": [["Item", "Status", "Date"], ["Privacy Policy", "Complete", "2024-01-15"], ["Security Assessment", "Complete", "2024-01-20"]]}]}',
  },
  {
    id: '9',
    name: 'vendor_analysis.csv',
    type: 'csv',
    isMapped: true,
    content:
      'Vendor ID,Vendor Name,Contract Value,Renewal Date\nV001,Global Supplies Inc,500000,2024-12-31\nV002,Tech Solutions Ltd,750000,2024-09-15',
  },
  {
    id: '10',
    name: 'quarterly_report.xlsx',
    type: 'xlsx',
    isMapped: false,
    content:
      '{"sheets": [{"name": "Q4 Report", "data": [["Metric", "Value", "YoY Growth"], ["Revenue", "12500000", "15%"], ["Expenses", "8000000", "8%"]]}]}',
  },
];

export { bots, Clients, audit_Procedures, files };
