import { useState } from 'react';
import { Search, ArrowDown, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import ReactSelect from 'react-select';
import { customStyles, customStylesForResizable } from '@/lib/utils';

const SetParameters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilterValue, setCategoryFilterValue] = useState<OptionType[]>([]);

  const categoryOptions_rs: OptionType[] = [
    { value: 'P2P', label: 'P2P' },
    { value: 'H2R', label: 'H2R' },
    { value: 'O2C', label: 'O2C' },
  ];

  interface OptionType {
    value: string;
    label: string;
  }

  // Form state
  const [effectiveDateTolerance, setEffectiveDateTolerance] = useState('');
  const [missingApprovalRef, setMissingApprovalRef] = useState('');
  const [ghostEmployeeMinDays, setGhostEmployeeMinDays] = useState('');
  const [bankAccountReuse, setBankAccountReuse] = useState('');
  const [maxOvertimeHours, setMaxOvertimeHours] = useState('');

  // Shared content for all accordions
  const renderAccordionContent = () => (
    <div className="px-6 py-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label className="block text-sm text-muted-foreground mb-2">
            Effective date mismatch tolerance
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="E.g. 10"
              value={effectiveDateTolerance}
              onChange={(e) => setEffectiveDateTolerance(e.target.value)}
              className="bg-card"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              &lt; Days from Approval
            </span>
          </div>
        </div>
        <div className="flex-1">
          <Label className="block text-sm text-muted-foreground mb-2">
            Missing approval reference
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="E.g. 10"
              value={missingApprovalRef}
              onChange={(e) => setMissingApprovalRef(e.target.value)}
              className="bg-card"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">Flag</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcedureContent = () => (
    <Card className="overflow-hidden">
      {/* Search */}
      <CardHeader>
        <div className="flex gap-4 w-full items-center px-2">
          {/* Search Bar → takes remaining space and can shrink */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchQuery ?? ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background pl-9 h-12 w-full" // w-full important
            />
          </div>

          {/* Multi-select + Reset → intrinsic width, grows with content */}
          <div className="flex items-center gap-4 w-auto">
            {/* make wrapper w-auto so react-select measures its content */}
            <div className="hidden sm:block w-auto">
              <ReactSelect
                isMulti
                options={categoryOptions_rs}
                value={categoryFilterValue}
                onChange={(selected) => {
                  const values = selected as OptionType[];
                  setCategoryFilterValue(values);
                }}
                placeholder="Category"
                styles={{ ...customStyles, ...customStylesForResizable }} // merge with your other styles
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Main Accordion */}
      <CardContent>
        <div className="flex justify-between items-center px-2">
          <Button
            variant="link"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground mb-2"
          >
            Audit Procedure
            <ArrowDown className="h-3 w-3" />
          </Button>
           <Button
            variant="default"
            className="flex items-center gap-1 text-sm font-medium mb-3"
          >
            <Check className="h-3 w-3" />
            Set as Default
            
          </Button>
        </div>
        <Accordion type="multiple" defaultValue={['ghost-employee']} className="w-full border">
          {/* Ghost Employee Detection */}
          <AccordionItem value="ghost-employee" className="border-b rounded-md">
            <AccordionTrigger className="px-6 py-3 hover:bg-muted/50 hover:no-underline">
              <span className="font-medium text-foreground">Ghost Employee Detection</span>
            </AccordionTrigger>
            <AccordionContent className="bg-background">
              {renderAccordionContent()}
            </AccordionContent>
          </AccordionItem>

          {/* Unauthorized Salary Changes */}
          <AccordionItem value="salary-changes" className="border-b">
            <AccordionTrigger className="px-6 py-3 hover:bg-muted/50 hover:no-underline">
              <span className="font-medium text-foreground">Unauthorized Salary Changes</span>
            </AccordionTrigger>
            <AccordionContent className="bg-background">
              {renderAccordionContent()}
            </AccordionContent>
          </AccordionItem>

          {/* Overtime Validation */}
          <AccordionItem value="overtime" className="border-b-0">
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
              <span className="font-medium text-foreground">Overtime Validation</span>
            </AccordionTrigger>
            <AccordionContent className="bg-background">
              {renderAccordionContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );

  const renderParameterContent = () => (
     <div className="grid grid-cols-3 gap-6">
      {/* Ghost Employee Detection */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Ghost Employee Detection
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="min-attendance" className="text-sm font-normal text-foreground mb-2 block">
              Minimum attendance days
            </Label>
            <div className="relative">
              <Input
                id="min-attendance"
                type="text"
                placeholder="E.g. 10"
                value={ghostEmployeeMinDays}
                onChange={(e) => setGhostEmployeeMinDays(e.target.value)}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Days
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="bank-account" className="text-sm font-normal text-foreground mb-2 block">
              Bank account reuse
            </Label>
            <div className="relative">
              <Input
                id="bank-account"
                type="text"
                placeholder="E.g. 10"
                value={bankAccountReuse}
                onChange={(e) => setBankAccountReuse(e.target.value)}
                className="pr-24"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                &lt; Employee
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Unauthorized Salary Changes */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Unauthorized Salary Changes
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="effective-date" className="text-sm font-normal text-foreground mb-2 block">
              Effective date mismatch tolerance
            </Label>
            <div className="relative">
              <Input
                id="effective-date"
                type="text"
                placeholder="E.g. 10"
                value={effectiveDateTolerance}
                onChange={(e) => setEffectiveDateTolerance(e.target.value)}
                className="pr-40"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground whitespace-nowrap">
                &lt; Days from Approval
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="missing-approval" className="text-sm font-normal text-foreground mb-2 block">
              Missing approval reference
            </Label>
            <div className="relative">
              <Input
                id="missing-approval"
                type="text"
                placeholder="E.g. 10"
                value={missingApprovalRef}
                onChange={(e) => setMissingApprovalRef(e.target.value)}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Flag
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Overtime Validation */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Overtime Validation
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="max-overtime" className="text-sm font-normal text-foreground mb-2 block">
              Max overtime hours per month
            </Label>
            <div className="relative">
              <Input
                id="max-overtime"
                type="text"
                placeholder="E.g. 10"
                value={maxOvertimeHours}
                onChange={(e) => setMaxOvertimeHours(e.target.value)}
                className="pr-20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                &lt; Hours
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  // const renderPlaceholderContent = (tabName: string) => (
  //   <Card className="flex items-center justify-center h-64">
  //     <p className="text-muted-foreground text-lg">{tabName} content coming soon...</p>
  //   </Card>
  // );

  return (
    <div className="mx-auto w-full">
      <Tabs defaultValue="procedure" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="procedure">Procedure Wise</TabsTrigger>
          <TabsTrigger value="paramters">Overall Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="procedure" className="mt-2">
          {renderProcedureContent()}
        </TabsContent>

        <TabsContent value="paramters" className="mt-2">
          {renderParameterContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetParameters;