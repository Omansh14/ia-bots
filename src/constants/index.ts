import type { Client, Bot, AuditProcedure, AuditData } from '@/types/index.types';

const Clients: Client[] = [
  {
    client_id: 'C-1001',
    name: 'Tata Motors',
    industry: 'Automobile',
    timestamp: new Date(),
    audit_procedures: 14,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1002',
    name: 'Tech Innovators',
    industry: 'Technology',
    timestamp: new Date(),
    audit_procedures: 25,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1003',
    name: 'Global Foods',
    industry: 'Manufacturing',
    timestamp: new Date(),
    audit_procedures: 10,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1004',
    name: 'EcoBuild',
    industry: 'Manufacturing',
    timestamp: new Date(),
    audit_procedures: 16,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1005',
    name: 'Finserve Solutions',
    industry: 'Technology',
    timestamp: new Date(),
    audit_procedures: 20,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1006',
    name: 'Greenwave Energy',
    industry: 'Energy',
    timestamp: new Date(),
    audit_procedures: 8,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1007',
    name: 'Apex Pharmaceuticals',
    industry: 'Healthcare',
    timestamp: new Date(),
    audit_procedures: 18,
    action: ['share', 'delete'],
  },
  {
    client_id: 'C-1008',
    name: 'Urban Retail Co.',
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
    audit_procedures: 22,
    action: ['share', 'delete'],
  },
];

const bots: Bot[] = [
  {
    id: "1",
    category: "P2P",
    auditProcedure: "Prevent duplicate vendors",
    description: "Match PAN, GST, bank account, vendor name"
  },
  {
    id: "2",
    category: "P2P",
    auditProcedure: "Validate vendor KYC",
    description: "Check missing PAN, GST, bank"
  },
  {
    id: "3",
    category: "P2P",
    auditProcedure: "Ensure PO–GRN–Invoice match",
    description: "3-way match"
  },
  {
    id: "4",
    category: "P2P",
    auditProcedure: "Detect post-invoice POs",
    description: "PO date after invoice date"
  },
  {
    id: "5",
    category: "P2P",
    auditProcedure: "Identify split orders",
    description: "Multiple small POs same vendor"
  },
  {
    id: "6",
    category: "P2P",
    auditProcedure: "Unauthorized vendor bank change",
    description: "Track master changes"
  },
  {
    id: "7",
    category: "P2P",
    auditProcedure: "Validate vendor GST",
    description: "Cross-check GST number format & validity"
  },
  {
    id: "8",
    category: "P2P",
    auditProcedure: "PO approval bypass",
    description: "PO without approval workflow ID"
  },
  {
    id: "9",
    category: "P2P",
    auditProcedure: "Price variance analysis",
    description: "Compare PO rate vs last 3 months"
  },
  {
    id: "10",
    category: "P2P",
    auditProcedure: "Excessive emergency purchases",
    description: "Count POs marked 'urgent'"
  },
  {
    id: "11",
    category: "P2P",
    auditProcedure: "Vendor concentration risk",
    description: "Spend % per vendor"
  },
  {
    id: "12",
    category: "P2P",
    auditProcedure: "GRN delay tracking",
    description: "GRN date vs delivery date"
  },
  {
    id: "13",
    category: "P2P",
    auditProcedure: "Unmatched GRNs",
    description: "GRNs without invoices after X days"
  },
  {
    id: "14",
    category: "P2P",
    auditProcedure: "Over-receipt",
    description: "GRN qty > PO qty"
  },
  {
    id: "15",
    category: "P2P",
    auditProcedure: "Payment term adherence",
    description: "Invoice date vs payment date"
  },
  {
    id: "16",
    category: "P2P",
    auditProcedure: "Duplicate invoice detection",
    description: "Same vendor/date/amount"
  },
  {
    id: "17",
    category: "P2P",
    auditProcedure: "Invoice to inactive vendor",
    description: "Match vendor status"
  },
  {
    id: "18",
    category: "P2P",
    auditProcedure: "Non-PO invoices",
    description: "Invoices without PO reference"
  },
  {
    id: "19",
    category: "P2P",
    auditProcedure: "Foreign currency mismatch",
    description: "Invoice currency ? PO currency"
  },
  {
    id: "20",
    category: "P2P",
    auditProcedure: "Round sum invoices",
    description: "Flag invoices with whole 000s"
  },
  {
    id: "21",
    category: "O2C",
    auditProcedure: "Credit limit breach",
    description: "SO+AR > limit"
  },
  {
    id: "23",
    category: "O2C",
    auditProcedure: "Duplicate invoices",
    description: "Same customer/date/amount"
  },
  {
    id: "24",
    category: "O2C",
    auditProcedure: "Sales without SO",
    description: "Invoice without SO ID"
  },
  {
    id: "25",
    category: "O2C",
    auditProcedure: "Negative sales",
    description: "Credit notes > invoice value"
  },
  {
    id: "29",
    category: "O2C",
    auditProcedure: "Multiple invoices per order",
    description: "Count invoices per SO"
  },
  {
    id: "32",
    category: "O2C",
    auditProcedure: "Zero-priced invoices",
    description: "Invoice value = 0"
  },
  {
    id: "33",
    category: "O2C",
    auditProcedure: "Missing customer master data",
    description: "Null GST, PAN, credit terms"
  },
  {
    id: "36",
    category: "O2C",
    auditProcedure: "Overdue delivery",
    description: "SO date vs delivery date"
  },
  {
    id: "37",
    category: "O2C",
    auditProcedure: "Dispatch without invoice",
    description: "Delivery ID without invoice"
  },
  {
    id: "39",
    category: "O2C",
    auditProcedure: "Excessive small-value sales",
    description: "Sales <?X repeated"
  },
  {
    id: "41",
    category: "H2R",
    auditProcedure: "Ghost employee detection",
    description: "Match payroll to attendance"
  },
  {
    id: "44",
    category: "H2R",
    auditProcedure: "Duplicate employees",
    description: "Match PAN, bank account"
  },
  {
    id: "47",
    category: "H2R",
    auditProcedure: "Inactive employees in payroll",
    description: "Exit date < current month"
  },
  {
    id: "49",
    category: "H2R",
    auditProcedure: "Statutory compliance – PF",
    description: "PF payment date vs due date"
  },
  {
    id: "50",
    category: "H2R",
    auditProcedure: "Statutory compliance – ESI",
    description: "ESI payment date vs due date"
  }
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
    jobId: "10102025-001",
    location: "Mumbai",
    auditProcedures: 112,
    exceptions: 167,
    startDate: "2024-04-23",
    endDate: "2025-01-03",
    createdOn: "2024-04-23",
    status: "In-Progress",
  },
  {
    jobId: "20240315-004",
    location: "Bengaluru",
    auditProcedures: 187,
    exceptions: 213,
    startDate: "2024-05-16",
    endDate: "2025-02-14",
    createdOn: "2024-05-16",
    status: "Completed",
  },
  {
    jobId: "20240315-008",
    location: "Chennai",
    auditProcedures: 145,
    exceptions: 154,
    startDate: "2024-06-28",
    endDate: "2025-03-29",
    createdOn: "2024-06-28",
    status: "Inactive",
  },
  {
    jobId: "20240315-007",
    location: "Kolkata",
    auditProcedures: 163,
    exceptions: 189,
    startDate: "2024-07-04",
    endDate: "2025-04-17",
    createdOn: "2024-07-04",
    status: "Completed",
  },
  {
    jobId: "20240315-006",
    location: "Hyderabad",
    auditProcedures: 152,
    exceptions: 172,
    startDate: "2024-08-19",
    endDate: "2025-05-22",
    createdOn: "2024-08-19",
    status: "Inactive",
  },
  {
    jobId: "20240315-003",
    location: "Pune",
    auditProcedures: 198,
    exceptions: 234,
    startDate: "2024-09-22",
    endDate: "2025-06-03",
    createdOn: "2024-09-22",
    status: "Inactive",
  },
  {
    jobId: "20240315-002",
    location: "Ahmedabad",
    auditProcedures: 105,
    exceptions: 87,
    startDate: "2024-10-01",
    endDate: "2025-07-18",
    createdOn: "2024-10-01",
    status: "Inactive",
  },
  {
    jobId: "20240315-008",
    location: "Surat",
    auditProcedures: 176,
    exceptions: 195,
    startDate: "2024-11-15",
    endDate: "2025-08-26",
    createdOn: "2024-11-15",
    status: "Completed",
  },
]

export {bots, Clients, audit_Procedures};