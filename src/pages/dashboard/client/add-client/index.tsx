import { Card, CardHeader } from '@/components/ui/card';
import { Outlet } from 'react-router-dom';
import Stepper from '@/components/stepper/Stepper';

const Index = () => {
  return (
    <Card className="p-6">
      <CardHeader className="h-auto w-full bg-transparent p-0">
        <Stepper />
      </CardHeader>
      <div className="mt-4">
        <Outlet />
      </div>
    </Card>
  );
};

export default Index;
