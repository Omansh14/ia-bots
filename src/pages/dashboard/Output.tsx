import { useState } from 'react';
import { AuditSidebar } from '@/components/sidebar/AuditSideBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SummaryTab } from '@/components/tabs/outputTabs/SummaryTab';
import { OutputTab } from '@/components/tabs/outputTabs/OutputTab';
import { ReportTab } from '@/components/tabs/outputTabs/ReportTab';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Output = () => {
  const [selectedItem, setSelectedItem] = useState('Summary (P2P)');
  const [activeTab, setActiveTab] = useState('output');
  const navigate = useNavigate();

  // Check if selected item is a summary
  const isSummary = selectedItem.toLowerCase().includes('summary');

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    // Reset to first available tab when switching items
    if (item.toLowerCase().includes('summary')) {
      setActiveTab('summary');
    } else {
      setActiveTab('output');
    }
  };

  return (
    <div className="flex bg-background gap-4 w-full">
      <AuditSidebar selectedItem={selectedItem} onItemSelect={handleItemSelect} />
      <Card className="w-4/5 py-2">
        <main className="flex-1 overflow-auto">
          <div className="mx-auto p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {isSummary ? 'Consolidated Output' : selectedItem}
                  </h1>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 hover:cursor-pointer"
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Return to Dashboard
                  </Button>
                  <Button
                    size="lg"
                    className="text-primary bg-primary/10 hover:bg-primary/20 hover:cursor-pointer"
                  >
                    Re-run
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {isSummary
                  ? 'Every detail distilled into one clear outcome'
                  : 'View detailed output and reports for this procedure'}
              </p>
            </div>

            {isSummary ? (
              // Show only summary content when a summary item is selected
              <SummaryTab />
            ) : (
              // Show tabs for Output and Report when non-summary items are selected
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="report">Report</TabsTrigger>
                </TabsList>

                <TabsContent value="output">
                  <OutputTab />
                </TabsContent>

                <TabsContent value="report">
                  <ReportTab />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </Card>
    </div>
  );
};

export default Output;