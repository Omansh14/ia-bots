import MappingPanel from '@/components/mapping/MappingPanel';
import FlowCanvas from '@/components/canvas/FlowCanvas';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Expand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CanvasLayout = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('../procedure-review');
  };
  return (
    <div className="flex h-screen w-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="lg"
          className="hover:cursor-pointer mr-3 bg-white"
          onClick={() => navigate('../../data-filtering')}
        >
          Edit Parameters
        </Button>
        <Button className="hover:cursor-pointer" variant="default" onClick={handleSubmit}>
          Save & Next
        </Button>
      </div>
      <Button
        className="absolute top-16 right-4 z-10 bg-white hover:cursor-pointer"
        variant="outline"
      >
        <Expand />
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
  );
};

export default CanvasLayout;
