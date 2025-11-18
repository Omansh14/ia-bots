import { useState } from 'react';
import { AuditSidebar } from '@/components/sidebar/AuditSideBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SummaryTab } from '@/components/tabs/outputTabs/SummaryTab';
import { OutputTab } from '@/components/tabs/outputTabs/OutputTab';
import { ReportTab } from '@/components/tabs/outputTabs/ReportTab';
import { AIReportsTab } from '@/components/tabs/outputTabs/AiReportTabs';
import { Card } from '@/components/ui/card';

const Output = () => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="flex h-screen bg-background gap-4 w-full">
      <AuditSidebar />
      <Card className='w-4/5 py-2'>
        <main className="flex-1 overflow-auto">
          <div className="mx-auto p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-2xl font-bold text-foreground">Consolidated Output</h1>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Return to Dashboard
                  </Button>
                  <Button size="sm" className="text-primary bg-primary/10 hover:bg-primary/20">
                    Re-run
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Every detail distilled into one clear outcome
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="ai-reports">AI Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <SummaryTab />
              </TabsContent>

              <TabsContent value="output">
                <OutputTab />
              </TabsContent>

              <TabsContent value="report">
                <ReportTab />
              </TabsContent>

              <TabsContent value="ai-reports">
                <AIReportsTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </Card>
    </div>
  );
};

export default Output;
