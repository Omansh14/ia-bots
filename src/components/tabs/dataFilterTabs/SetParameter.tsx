import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SetParameters = () => {
  const [ghostEmployeeMinDays, setGhostEmployeeMinDays] = useState('');
  const [bankAccountReuse, setBankAccountReuse] = useState('');
  const [effectiveDateTolerance, setEffectiveDateTolerance] = useState('');
  const [missingApprovalRef, setMissingApprovalRef] = useState('');
  const [maxOvertimeHours, setMaxOvertimeHours] = useState('');

  const renderP2PContent = () => (
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
  );

  const renderPlaceholderContent = (tabName: string) => (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground text-lg">
        {tabName} content coming soon...
      </p>
    </div>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="p2p" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="p2p">P2P</TabsTrigger>
          <TabsTrigger value="h2r">H2R</TabsTrigger>
          <TabsTrigger value="o2c">O2C</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="p2p" className="mt-2">
          {renderP2PContent()}
        </TabsContent>

        <TabsContent value="h2r" className="mt-2">
          {renderPlaceholderContent('H2R')}
        </TabsContent>

        <TabsContent value="o2c" className="mt-2">
          {renderPlaceholderContent('O2C')}
        </TabsContent>

        <TabsContent value="other" className="mt-2">
          {renderPlaceholderContent('Other')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetParameters;