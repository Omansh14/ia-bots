import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Search } from 'lucide-react';

const industries = [
  'Fintech',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Technology',
  'Energy',
  'Education',
];

const CreateAuditProcedure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className='p-6'>
      <CardHeader className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Audit Procedure</h1>
          <p className="text-sm text-muted-foreground">Create and configure a new audit procedure</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-5">
            <Label htmlFor="auditProcedure">Audit Procedure</Label>
            <Input id="auditProcedure" placeholder="Audit Procedure" className="mt-1" />
          </div>

          <div className="col-span-3">
            <Label htmlFor="industry">Industry</Label>
            <Select>
              <SelectTrigger id="industry" className="w-full mt-1">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-4">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Description" className="mt-1" />
          </div>
        </div>

      <div className="grid grid-cols-12 gap-4 mt-6">
        {/* Left sidebar - Columns list */}
        <aside className="col-span-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Columns</h3>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-9" />
            </div>

            <div className="space-y-2 bg-gray-100 bg-bg-max-h-100 overflow-y-auto">
              <div className="px-3 py-2 rounded bg-white/50">Employee Name</div>
              <div className="px-3 py-2 rounded bg-white/50">Vendor Name</div>
              <div className="px-3 py-2 rounded bg-white/50">Employee ID</div>
              <div className="px-3 py-2 rounded bg-white/50">Registration Number</div>
              <div className="px-3 py-2 rounded bg-white/50">Name of Client</div>
              <div className="px-3 py-2 rounded bg-white/50">Salary</div>
              <div className="px-3 py-2 rounded bg-white/50">Units Ordered</div>
              <div className="px-3 py-2 rounded bg-white/50">Sales</div>
              <div className="px-3 py-2 rounded bg-white/50">Marketing</div>
              <div className="px-3 py-2 rounded bg-white/50">Customer Support</div>
            </div>
          </Card>
        </aside>

        {/* Center canvas area (empty for now) */}
        <main className="col-span-6">
          <Card className="p-6 h-[60vh] flex flex-col items-center justify-center border-dashed">
            <div className="text-center text-muted-foreground">
              <div className="mb-2 font-medium">Drag &amp; drop columns and operations to define logic</div>
            </div>
          </Card>
        </main>

        {/* Right side - placeholders */}
        <aside className="col-span-3 space-y-4">
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Grouping</h4>
            <div className="h-24 bg-white/50 rounded" />
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Operators</h4>
            <div className="h-24 bg-white/50 rounded" />
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Output Format</h4>
            <div className="h-20 bg-white/50 rounded" />
          </Card>
        </aside>
      </div>
      </CardContent>

    </Card>
  );
};

export default CreateAuditProcedure;
