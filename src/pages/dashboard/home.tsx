import { Button } from "@/components/ui/button";
import { Sparkles, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClientClick = () => {
     navigate('/clients')
  }
  return (
    <div className="space-y-2">
      {/* Heading */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-secondary">Welcome User!</h1>
          <p className="text-sm text-gray-600">Your workspace is ready!. Use the panels below to pick up where you left off or start something new. </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hover:cursor-pointer" onClick={() => navigate('audit-procedures')}> <Sparkles className="h-3 w-3 text-blue-500"/>Bots Library</Button>
          <Button size="sm" className="hover:cursor-pointer" onClick={handleClientClick}><Users className="h-3 w-3 text-white"/>Clients</Button>
        </div>
      </div>
      {/* Banner */}
      <div className="mt-6 relative">
        <img src="/src/assets/home-banner.svg" className="w-full rounded-lg"/>
        <div className="absolute z-1 flex flex-col gap-2 top-1/4 left-6">
          <h2 className="text-4xl font-semibold text-secondary max-w-sm">Get Started with Auditbots</h2>
          <div className="flex max-w-lg p-4 ">
            <Button size="xl" className="hover:cursor-pointer" onClick={() => navigate('clients/add-client')}><img src="/src/assets/plusIcon.svg"/>Run Audit Procedure</Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className=""></div>
    </div>
  );
};

export default Home;
