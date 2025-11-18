import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, Share2 } from "lucide-react";
import {AuditTable} from "@/components/tables/audit-table/table";
import { auditData } from "@/constants";
import { useLocation, useNavigate } from "react-router-dom";

const ClientInfo = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const clientName = location.state?.client || "Client";

  const locations = ["all", ...Array.from(new Set(auditData.map((item) => item.location)))];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto ">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">{clientName}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button className="hover:cursor-pointer" onClick={() => navigate('../add-client')}>Run Bots</Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.slice(1).map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    <SelectItem value="q1">Q1 2024</SelectItem>
                    <SelectItem value="q2">Q2 2024</SelectItem>
                    <SelectItem value="q3">Q3 2024</SelectItem>
                    <SelectItem value="q4">Q4 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Financial Year
                </label>
                <Select
                  value={selectedFinancialYear}
                  onValueChange={setSelectedFinancialYear}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Financial Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">FY 2024</SelectItem>
                    <SelectItem value="2025">FY 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <AuditTable
              data={auditData}
              searchQuery={searchQuery}
              selectedLocation={selectedLocation}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientInfo;
