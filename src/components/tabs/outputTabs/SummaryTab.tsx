import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/cards/StatCard";

const failedProcedures = [
  {
    id: 0,
    name: "Validate Vendor KYC",
    category: "P2P",
    reason: "Missing vendor info for Zephyr Inc. invoices.",
  },
  {
    id: 1,
    name: "PO-GRN-Invoice Match",
    category: "P2P",
    reason: "Discrepancies found in Nexus Corp's order #592 details.",
  },
  {
    id: 2,
    name: "Post-Invoice POs",
    category: "P2P",
    reason: "Chronos Ltd invoice #881 predates its corresponding PO.",
  },
];

export const SummaryTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard value={245} label="Total Audit Procedures" />
        <StatCard value={211} label="Successful Run" />
        <StatCard value={73} label="Exceptions Found" />
        <StatCard value={34} label="Failed Audit Procedures" />
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Failed Audit Procedures</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-16"></TableHead>
              <TableHead>Audit Procedures</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Failure Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failedProcedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell className="text-muted-foreground">{procedure.id}</TableCell>
                <TableCell className="font-medium">{procedure.name}</TableCell>
                <TableCell>{procedure.category}</TableCell>
                <TableCell className="text-muted-foreground">{procedure.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};