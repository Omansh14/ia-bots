import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface FilterRow {
  id: string;
  column: string;
  condition: string;
  value: string;
  auditProcedure: string;
}

export const FilterForm = () => {
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: '1', column: '', condition: '', value: '', auditProcedure: '' },
  ]);

  const addFilter = () => {
    const newFilter: FilterRow = {
      id: Date.now().toString(),
      column: '',
      condition: '',
      value: '',
      auditProcedure: '',
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    if (filters.length > 1) {
      setFilters(filters.filter((filter) => filter.id !== id));
    }
  };

  const updateFilter = (id: string, field: keyof FilterRow, value: string) => {
    setFilters(
      filters.map((filter) => (filter.id === id ? { ...filter, [field]: value } : filter)),
    );
  };

  return (
    <div className="space-y-4 p-4 bg-accent/30">
      <div className="space-y-3">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-3">
            <div className="flex flex-1 gap-3">
              <div className="w-full">
                <label className="text-xs text-muted-foreground mb-1 block">Column</label>
                <Select
                  value={filter.column}
                  onValueChange={(value) => updateFilter(filter.id, 'column', value)}
                >
                  <SelectTrigger className="bg-background w-full">
                    <SelectValue placeholder="Column" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="employee_id">Employee ID</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label className="text-xs text-muted-foreground mb-1 block">Condition</label>
                <Select
                  value={filter.condition}
                  onValueChange={(value) => updateFilter(filter.id, 'condition', value)}
                >
                  <SelectTrigger className="bg-background w-full">
                    <SelectValue placeholder="is equal to" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50" defaultValue="">
                    <SelectItem value="equals">is equal to</SelectItem>
                    <SelectItem value="not_equals">is not equal to</SelectItem>
                    <SelectItem value="contains">contains</SelectItem>
                    <SelectItem value="not_contains">does not contain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">
                <label className="text-xs text-muted-foreground mb-1 block">Value</label>
                <Input
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  className="bg-background w-full"
                />
              </div>

              <div className="w-full">
                <label className="text-xs text-muted-foreground mb-1 block">Audit Procedures</label>
                <Select
                  value={filter.auditProcedure}
                  onValueChange={(value) => updateFilter(filter.id, 'auditProcedure', value)}
                >
                  <SelectTrigger className="bg-background w-full">
                    <SelectValue placeholder="Audit Procedures" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50" defaultValue="">
                    <SelectItem value="review">Prevent Duplicate Vendors</SelectItem>
                    <SelectItem value="verify">Ghost Employee Detection</SelectItem>
                    <SelectItem value="validate">Ensure PO-GRN-Invoice match</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter(filter.id)}
              className="mt-5 hover:bg-destructive/10 hover:text-destructive"
              disabled={filters.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={addFilter}
        className="text-primary hover:text-primary hover:bg-accent"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Filter
      </Button>
    </div>
  );
};
