import ClientTable from '@/components/tables/client-table/client-table';
const Client = () => {
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
      </div>
      {/*------------ Client Table ---------------------*/}
      <div className="w-full">
        <ClientTable />
      </div>
    </div>
  );
};

export default Client;
