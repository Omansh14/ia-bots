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
    "id": "1",
    "category": "P2P",
    "auditProcedure": "Validate Vendor KYC",
    "description": "Validates vendor master data for missing or invalid KYC fields such as PAN, GST, or bank account details."
  },
  {
    "id": "2",
    "category": "P2P",
    "auditProcedure": "PO-GRN-Invoice Match",
    "description": "Validate that invoices are matched against approved purchase orders and corresponding GRNs to ensure 3-way matching."
  },
  {
    "id": "3",
    "category": "P2P",
    "auditProcedure": "Post-Invoice POs",
    "description": "Flags purchase orders created after the corresponding invoice date, indicating potential control bypass."
  },
  {
    "id": "4",
    "category": "P2P",
    "auditProcedure": "Split Orders",
    "description": "Analyzes procurement transactions to detect multiple small POs created for the same vendor to bypass approval thresholds."
  },
  {
    "id": "5",
    "category": "P2P",
    "auditProcedure": "Duplicate Vendors",
    "description": "Detects and prevents creation of duplicate vendor records by matching key identifiers like PAN, GST, and bank account."
  },
  {
    "id": "6",
    "category": "P2P",
    "auditProcedure": "Unauthorized Vendor Bank Change",
    "description": "Monitors vendor master data updates to detect suspicious or unauthorized bank account changes."
  },
  {
    "id": "7",
    "category": "P2P",
    "auditProcedure": "Validate Vendor GST",
    "description": "Validates vendor GST number format and correctness based on standard GSTIN validation rules."
  },
  {
    "id": "8",
    "category": "P2P",
    "auditProcedure": "PO Approval Bypass",
    "description": "Identifies purchase orders created without passing through the designated approval workflow."
  },
  {
    "id": "9",
    "category": "P2P",
    "auditProcedure": "Price Variance Analysis",
    "description": "Compares PO item prices with historical prices for the same item or vendor to detect unusual rate changes."
  },
  {
    "id": "10",
    "category": "P2P",
    "auditProcedure": "Excessive Emergency Purchases",
    "description": "Counts purchase orders marked as 'urgent' or 'emergency' to identify potential misuse of emergency purchase controls."
  },
  {
    "id": "11",
    "category": "P2P",
    "auditProcedure": "Vendor Concentration Risk",
    "description": "Calculates spend concentration per vendor to highlight over-dependence on a few vendors."
  },
  {
    "id": "12",
    "category": "P2P",
    "auditProcedure": "GRN Delay Tracking",
    "description": "Tracks delays between goods delivery date and GRN posting date to detect process inefficiencies."
  },
  {
    "id": "13",
    "category": "P2P",
    "auditProcedure": "Unmatched GRNs",
    "description": "Identifies GRNs that remain unmatched with invoices beyond a specified number of days."
  },
  {
    "id": "14",
    "category": "P2P",
    "auditProcedure": "Over-receipt",
    "description": "Flags GRNs where received quantity exceeds PO quantity, indicating possible over-receipt issues."
  },
  {
    "id": "15",
    "category": "P2P",
    "auditProcedure": "Payment Term Adherence",
    "description": "Analyzes vendor payment timelines against agreed payment terms."
  },
  {
    "id": "16",
    "category": "P2P",
    "auditProcedure": "Duplicate Invoice Detection",
    "description": "Detects duplicate invoices by comparing vendor, invoice date, and invoice amount combinations."
  },
  {
    "id": "17",
    "category": "P2P",
    "auditProcedure": "Invoice to Inactive Vendor",
    "description": "Identifies invoices issued to vendors whose status is inactive or blocked."
  },
  {
    "id": "18",
    "category": "P2P",
    "auditProcedure": "Non-PO Invoices",
    "description": "Flags invoices that do not reference any purchase order."
  },
  {
    "id": "19",
    "category": "P2P",
    "auditProcedure": "Foreign Currency Mismatch",
    "description": "Identifies invoices where the currency does not match the associated purchase order currency."
  },
  {
    "id": "20",
    "category": "P2P",
    "auditProcedure": "Round Sum Invoices",
    "description": "Flags invoices with unusually rounded values such as exact multiples of 1,000."
  },
  {
    "id": "21",
    "category": "O2C",
    "auditProcedure": "Credit Limit Breach",
    "description": "Identifies customers whose outstanding receivables and open sales orders exceed their credit limits."
  },
  {
    "id": "22",
    "category": "O2C",
    "auditProcedure": "Duplicate Invoices",
    "description": "Detects duplicate sales invoices using combinations like customer, date, and invoice amount."
  },
  {
    "id": "23",
    "category": "O2C",
    "auditProcedure": "Sales Without SO",
    "description": "Identifies sales invoices created without a corresponding sales order."
  },
  {
    "id": "24",
    "category": "O2C",
    "auditProcedure": "Negative Sales",
    "description": "Flags cases where credit notes exceed corresponding invoice values."
  },
  {
    "id": "25",
    "category": "O2C",
    "auditProcedure": "Multiple Invoices Per Order",
    "description": "Counts number of invoices raised against each sales order to detect anomalies."
  },
  {
    "id": "26",
    "category": "O2C",
    "auditProcedure": "Zero-Priced Invoices",
    "description": "Identifies invoices with zero total value."
  },
  {
    "id": "27",
    "category": "O2C",
    "auditProcedure": "Missing Customer Master Data",
    "description": "Flags customer master records missing key fields like GST, PAN, or credit terms."
  },
  {
    "id": "28",
    "category": "O2C",
    "auditProcedure": "Overdue Delivery",
    "description": "Compares sales order date with delivery date to flag delayed deliveries."
  },
  {
    "id": "29",
    "category": "O2C",
    "auditProcedure": "Dispatch Without Invoice",
    "description": "Identifies dispatch records where goods have been shipped but no invoice has been generated."
  },
  {
    "id": "30",
    "category": "O2C",
    "auditProcedure": "Excessive Small-Value Sales",
    "description": "Identifies repeated small-value transactions below a threshold."
  },
  {
    "id": "31",
    "category": "H2R",
    "auditProcedure": "Ghost Employee Detection",
    "description": "Detects employees receiving payroll but having no attendance records."
  },
  {
    "id": "32",
    "category": "H2R",
    "auditProcedure": "Duplicate Employees",
    "description": "Matches PAN, bank account, or other identifiers to detect duplicate employee records."
  },
  {
    "id": "33",
    "category": "H2R",
    "auditProcedure": "Inactive Employees in Payroll",
    "description": "Identifies employees still appearing in payroll after their recorded exit date."
  },
  {
    "id": "34",
    "category": "H2R",
    "auditProcedure": "Statutory Compliance – PF",
    "description": "Checks PF deposit date against statutory due dates."
  },
  {
    "id": "35",
    "category": "H2R",
    "auditProcedure": "Statutory Compliance – ESI",
    "description": "Checks ESI deposit date against statutory due dates."
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