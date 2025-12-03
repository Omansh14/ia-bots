import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Pencil, Search, Share2, Download } from 'lucide-react';
import { AuditTable } from '@/components/tables/audit-table/table';
import { auditData } from '@/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateClientForm } from '@/components/forms/CreateClientForm';
import { type ClientFormData } from '@/components/forms/CreateClientForm';
import ReactSelect from 'react-select';

// Option type for react-select
interface OptionType {
  value: string;
  label: string;
}

const ClientInfo = () => {
  const [locationFilter, setLocationFilter] = useState<OptionType[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<OptionType[]>([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<OptionType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const clientName = location.state?.client || 'Client';
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateClient = (data: ClientFormData) => {
    console.log('Creating client with data:', data);
    // TODO: Add your API call or state management logic here
  };

  // Transform data to react-select options
  const locations = [...Array.from(new Set(auditData.map((item) => item.location)))];
  const locationOptions: OptionType[] = locations.map((loc) => ({
    value: loc,
    label: loc,
  }));

  const periodOptions: OptionType[] = [
    { value: 'q1', label: 'Q1 2024' },
    { value: 'q2', label: 'Q2 2024' },
    { value: 'q3', label: 'Q3 2024' },
    { value: 'q4', label: 'Q4 2024' },
  ];

  const financialYearOptions: OptionType[] = [
    { value: '2024', label: 'FY 2024' },
    { value: '2025', label: 'FY 2025' },
  ];

  // Custom styles for react-select to match design system
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '40px',
      borderRadius: '0.5rem',
      boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--ring))' : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--border))',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      zIndex: 50,
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '0.25rem',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '0.375rem',
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
        ? 'hsl(var(--accent))'
        : 'transparent',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
      },
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
      borderRadius: '0 0.25rem 0.25rem 0',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--muted-foreground))',
      fontSize: '0.875rem',
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto">
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
                  <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  className="hover:cursor-pointer"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button className="hover:cursor-pointer" onClick={() => navigate('../add-client')}>
                  Run Bots
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                <ReactSelect
                  isMulti
                  options={locationOptions}
                  value={locationFilter}
                  onChange={(selected) => setLocationFilter(selected as OptionType[])}
                  placeholder="Select location"
                  styles={customStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  closeMenuOnSelect={false}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Period</Label>
                <ReactSelect
                  isMulti
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={(selected) => setSelectedPeriod(selected as OptionType[])}
                  placeholder="Select period"
                  styles={customStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  closeMenuOnSelect={false}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Financial Year</Label>
                <ReactSelect
                  isMulti
                  options={financialYearOptions}
                  value={selectedFinancialYear}
                  onChange={(selected) => setSelectedFinancialYear(selected as OptionType[])}
                  placeholder="Select financial year"
                  styles={customStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  closeMenuOnSelect={false}
                />
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
              selectedLocation={locationFilter.map((opt) => opt.value)}
              selectedPeriod={selectedPeriod.map((opt) => opt.value)}
            />
          </CardContent>
        </Card>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-bold">Edit Client</DialogTitle>
            </DialogHeader>
            <CreateClientForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleCreateClient}
              type="edit"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientInfo;