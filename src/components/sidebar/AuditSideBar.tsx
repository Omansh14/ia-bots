import { ChevronDown, ChevronRight, LayoutGrid, Search, FileMinus2, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "../ui/card";

type AuditSidebarProps = {
  onSearchChange?: (value: string) => void;
};

export const AuditSidebar = ({ onSearchChange }: AuditSidebarProps) => {
  const [p2pExpanded, setP2pExpanded] = useState(true);
  const [h2rExpanded, setH2rExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Category items
  const p2pItems = [
    "All (P2P)",
    "Validate Vendor KYC",
    "PO-GRN-Invoice Match",
    "Post-Invoice POs",
    "Split Orders",
    "Duplicate Vendors",
  ];

  const h2rItems = [
    "All (H2R)",
    "Background Verification",
    "Offer Letter Mismatch",
    "Duplicate Hires",
  ];

  const q = searchValue.trim().toLowerCase();
  const filteredP2p = q ? p2pItems.filter((i) => i.toLowerCase().includes(q)) : p2pItems;
  const filteredH2r = q ? h2rItems.filter((i) => i.toLowerCase().includes(q)) : h2rItems;

  const showP2p = filteredP2p.length > 0;
  const showH2r = filteredH2r.length > 0;

  return (
    <Card className="w-1/5 py-2 border-r border-border h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground mb-1">Advanced Filters</h2>
        <p className="text-sm text-muted-foreground mb-3">Filter your data</p>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 h-9 text-sm"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              onSearchChange?.(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button
            onClick={() => {
              setSearchValue("");
              onSearchChange?.("");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>All</span>
          </button>

          {showP2p && (
            <div className="mt-1">
              <button
                onClick={() => setP2pExpanded(!p2pExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileMinus2 className="h-4 w-4"/>
                  <span>P2P</span>
                </div>
                {p2pExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              { (q ? true : p2pExpanded) && (
                <div className="ml-6 mt-1 space-y-1">
                  {filteredP2p.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        const val = item.startsWith("All") ? "" : item;
                        setSearchValue(val);
                        onSearchChange?.(val);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm ${item.startsWith("All") ? 'text-primary bg-primary/10 font-medium rounded-md' : 'text-foreground hover:bg-muted rounded-md transition-colors'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {showH2r && (
            <div className="mt-1">
              <button
                onClick={() => setH2rExpanded(!h2rExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4"/>
                  <span>H2R</span>
                </div>
                {h2rExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              { (q ? true : h2rExpanded) && (
                <div className="ml-6 mt-1 space-y-1">
                  {filteredH2r.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        const val = item.startsWith("All") ? "" : item;
                        setSearchValue(val);
                        onSearchChange?.(val);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm ${item.startsWith("All") ? 'text-primary bg-primary/10 font-medium rounded-md' : 'text-foreground hover:bg-muted rounded-md transition-colors'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors mt-1">
            <Star className="mr-2 h-4 w-4" />
            <span>Premium Output</span>
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-border text-center">
        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-4 text-white">
          <p className="text-sm font-medium mb-2">Launch a new check to validate details afresh!</p>
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-medium rounded-full">
            Run a New Check
          </Button>
        </div>
      </div>
    </Card>
  );
};