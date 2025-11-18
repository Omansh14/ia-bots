import { FilterForm } from '@/components/forms/FilterForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const RefineData = ({ fileNames }: { fileNames: string[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const filteredFiles = fileNames.filter((file) =>
    file.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const toggleRow = (fileName: string) => {
    const newOpenRows = new Set(openRows);
    if (newOpenRows.has(fileName)) {
      newOpenRows.delete(fileName);
    } else {
      newOpenRows.add(fileName);
    }
    setOpenRows(newOpenRows);
  };
  return (
    <Tabs defaultValue="p2p" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger
          value="p2p"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          P2P
        </TabsTrigger>
        <TabsTrigger
          value="h2r"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          H2R
        </TabsTrigger>
        <TabsTrigger
          value="o2c"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          O2C
        </TabsTrigger>
        <TabsTrigger
          value="other"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Other
        </TabsTrigger>
      </TabsList>

      {/* Content for each category tab */}
      {['p2p', 'h2r', 'o2c', 'other'].map((category) => (
        <TabsContent key={category} value={category}>
          <div className="bg-card border rounded-lg overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            {/* Table */}
            <div>
              {/* Table Header */}
              <div className="bg-muted px-4 py-3 border-b">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span>File Name</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              {/* Table Body */}
              <div>
                {filteredFiles.map((fileName) => (
                  <Collapsible
                    key={fileName}
                    open={openRows.has(fileName)}
                    onOpenChange={() => toggleRow(fileName)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center gap-2 px-4 py-3 hover:bg-accent/50 transition-colors border-b">
                        {openRows.has(fileName) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-foreground">{fileName}</span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <FilterForm />
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
export default RefineData;
