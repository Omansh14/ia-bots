import MappingPanel from '@/components/mapping/MappingPanel';
import FlowCanvas from '@/components/canvas/FlowCanvas';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { ArrowDownToLine, ArrowLeft, Expand, Logs } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CanvasLayout = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('../procedure-review');
  };
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Mapping</h1>
            <p className="text-sm text-muted-foreground">
              Align your data fields to the required procedure format
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="hover:cursor-pointer bg-white"
            onClick={() => navigate('../../data-filtering')}
          >
            Edit Parameters
          </Button>
          <Button className="hover:cursor-pointer" variant="default" onClick={handleSubmit}>
            Proceed
          </Button>
        </div>
      </div>
      <div className="flex h-screen w-full relative">
        <Button
          className="absolute top-4 right-28 z-10 bg-white hover:cursor-pointer"
          variant="outline"
        >
          <ArrowDownToLine />
        </Button>
        <Button
          className="absolute top-4 right-16 z-10 bg-white hover:cursor-pointer"
          variant="outline"
        >
          <Expand />
        </Button>
        <Button
          className="absolute top-4 right-4 z-10 bg-white hover:cursor-pointer"
          variant="outline"
        >
          <Logs />
        </Button>
        <div className="w-72 flex-shrink-0">
          <MappingPanel />
        </div>
        <div className="flex-1">
          <FlowCanvas />
        </div>
        <Tabs defaultValue="p2p" className="flex flex-col absolute left-76 w-50 z-10 top-4">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-white rounded-lg shadow-md">
            <TabsTrigger value="p2p">P2P</TabsTrigger>
            <TabsTrigger value="h2r">H2R</TabsTrigger>
            <TabsTrigger value="o2c">O2C</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};

export default CanvasLayout;
