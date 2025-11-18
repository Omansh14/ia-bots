import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import RefineData from '@/components/tabs/dataFilterTabs/RefineData';
import SetParameters from '@/components/tabs/dataFilterTabs/SetParameter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const fileNames = [
  'Employee_Records',
  'Vendor_List_2024',
  'Client_Contracts_Q3',
  'Financial_Report_2024',
  'Inventory_Data_Current',
  'Sales_Figures_December',
];

const DataFiltering = () => {
  const navigate = useNavigate();

  return (
    <Card>
      {/* Header */}
      <header className="border-b">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Data Filtering</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter your data & map parameters to help bots focus only on what matters
                </p>
              </div>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save
            </Button>
          </div>
        </CardHeader>
      </header>
      <CardContent>
        <Tabs defaultValue="refine" className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger
              value="refine"
              className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:font-semibold"
            >
              Refine Your Data
            </TabsTrigger>
            <TabsTrigger
              value="parameters"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:font-semibold"
            >
              Set Parameters
            </TabsTrigger>
          </TabsList>
          <TabsContent value="refine" className="mt-4 ml-4">
            <RefineData fileNames={fileNames} />
          </TabsContent>
          <TabsContent value="parameters" className="mt-4 ml-4">
           <SetParameters />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataFiltering;
