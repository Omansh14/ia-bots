import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { audit_Procedures } from '@/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuditProcedureTable } from '@/components/tables/audit-procedures/table';
import { useNavigate } from 'react-router-dom';

export default function AuditProcedureLibrary() {
  const [industry, setIndustry] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [auditProcedure, setAuditProcedure] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Card>
      <CardHeader className="mb-2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" className="mt-1" onClick={handleBackClick}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Audit Procedure Library</h1>
              <p className="text-muted-foreground text-sm">
                Explore all the audit procedures based on category
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Create Audit Procedure
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Industry</label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="p2p">P2P</SelectItem>
                <SelectItem value="h2r">H2R</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Audit Procedure
            </label>
            <Select value={auditProcedure} onValueChange={setAuditProcedure}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="vendor">Vendor Related</SelectItem>
                <SelectItem value="employee">Employee Related</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <AuditProcedureTable
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
            audit_Procedures={audit_Procedures}
          />
        </div>
      </CardContent>
    </Card>
  );
}
