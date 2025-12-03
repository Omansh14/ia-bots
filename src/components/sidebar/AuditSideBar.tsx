import { FileMinus2, Users, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AuditSidebarProps = {
  selectedItem?: string;
  onItemSelect?: (item: string) => void;
};

export const AuditSidebar = ({ selectedItem = "Summary (P2P)", onItemSelect }: AuditSidebarProps) => {
  // Category items - first item is always summary
  const p2pItems = [
    "Summary (P2P)",
    "Validate Vendor KYC",
    "PO-GRN-Invoice Match",
    "Post-Invoice POs",
    "Split Orders",
    "Duplicate Vendors",
  ];

  const h2rItems = [
    "Summary (H2R)",
    "Background Verification",
    "Offer Letter Mismatch",
    "Duplicate Hires",
  ];

  const o2cItems = [
    "Summary (O2C)",
    "Invoice Processing",
    "Payment Reconciliation",
  ];

  const handleItemClick = (item: string) => {
    onItemSelect?.(item);
  };

  const renderItems = (items: string[]) => {
    return items.map((item) => {
      const isSelected = selectedItem === item;
      
      return (
        <button
          key={item}
          onClick={() => handleItemClick(item)}
          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
            isSelected
              ? 'bg-primary text-primary-foreground font-medium'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          {item}
        </button>
      );
    });
  };

  return (
    <Card className="w-1/5 py-2 border-r border-border h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground mb-3">Select Audit Procedure</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <Accordion type="single" collapsible defaultValue="p2p" className="w-full">
            <AccordionItem value="p2p" className="border-none">
              <AccordionTrigger className="px-3 py-2 hover:bg-muted rounded-md hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileMinus2 className="h-4 w-4" />
                  <span className="font-medium">P2P</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pr-1 pl-5 pt-2 pb-0 bg-gray-100 rounded-lg">
                <div className="space-y-1">
                  {renderItems(p2pItems)}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="h2r" className="border-none">
              <AccordionTrigger className="px-3 py-2 hover:bg-muted rounded-md hover:no-underline">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">H2R</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1 pt-2 pb-0">
                <div className="space-y-1">
                  {renderItems(h2rItems)}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="o2c" className="border-none">
              <AccordionTrigger className="px-3 py-2 hover:bg-muted rounded-md hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">O2C</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1 pt-2 pb-0">
                <div className="space-y-1">
                  {renderItems(o2cItems)}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors mt-2">
            <Star className="h-4 w-4" />
            <span>Premium Output</span>
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-border text-center">
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-4 text-white">
          <p className="text-sm font-medium mb-2">
            Launch a new check to validate details afresh!
          </p>
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-medium rounded-full">
            Run a New Check
          </Button>
        </div>
      </div>
    </Card>
  );
};