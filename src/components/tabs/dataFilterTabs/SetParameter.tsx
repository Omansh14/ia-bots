import { useState } from "react";
import { Search, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SetParameters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [effectiveDateTolerance, setEffectiveDateTolerance] = useState("");
  const [missingApprovalRef, setMissingApprovalRef] = useState("");

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
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Flag
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderP2PContent = () => (
    <Card className="overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-3 border-b">
        <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          Audit Procedure
          <ArrowDown className="h-3 w-3" />
        </button>
      </div>

      {/* Main Accordion */}
      <Accordion type="multiple" defaultValue={["ghost-employee"]} className="w-full">
        {/* Ghost Employee Detection */}
        <AccordionItem value="ghost-employee" className="border-b">
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
    </Card>
  );

  const renderPlaceholderContent = (tabName: string) => (
    <Card className="flex items-center justify-center h-64">
      <p className="text-muted-foreground text-lg">
        {tabName} content coming soon...
      </p>
    </Card>
  );

  return (
    <div className="mx-auto w-full">
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
          {renderPlaceholderContent("H2R")}
        </TabsContent>

        <TabsContent value="o2c" className="mt-2">
          {renderPlaceholderContent("O2C")}
        </TabsContent>

        <TabsContent value="other" className="mt-2">
          {renderPlaceholderContent("Other")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetParameters;