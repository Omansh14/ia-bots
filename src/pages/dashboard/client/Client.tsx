import { useState } from 'react';
import ClientTable from '@/components/tables/client-table/client-table';
import { Button } from '@/components/ui/button';
import { Plus, Archive } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateClientForm, type ClientFormData } from '@/components/forms/CreateClientForm';

const Client = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateClient = (data: ClientFormData) => {
    console.log('Creating client with data:', data);
    // TODO: Add your API call or state management logic here
  };

  return (
    <div className="space-y-2">
      {/* Heading */}
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-secondary">Clients</h1>
          <p className="text-sm text-gray-600">
            Manage your client relationships and track performance
          </p>
        </div>
        <div className="flex gap-3">
          {/* Archived Client */}
          <Button
            variant="default"
            className="hover:cursor-pointer"
            // onClick={() => setIsDialogOpen(true)}
          >
            <Archive className="w-10 h-10 text-white" />
            Archive Clients
          </Button>
          <Button
            variant="default"
            className="hover:cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-10 h-10 text-white" />
            Create Client
          </Button>
        </div>
      </div>

      {/* Create Client Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Create Client</DialogTitle>
          </DialogHeader>
          <CreateClientForm onClose={() => setIsDialogOpen(false)} onSubmit={handleCreateClient} />
        </DialogContent>
      </Dialog>

      {/*------------ Client Table ---------------------*/}
      <div className="w-full">
        <ClientTable />
      </div>
    </div>
  );
};

export default Client;
