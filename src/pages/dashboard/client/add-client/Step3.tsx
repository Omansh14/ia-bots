import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Search, GripVertical, AlertCircle } from 'lucide-react';
import type{ UploadedFile, Category, DragData } from '@/types/index.types';


// Draggable File Component
const DraggableFile = ({ file, fromCategory = null }: { file: UploadedFile; fromCategory?: string | null }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    const dragData: DragData = { file, fromCategory };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex items-center justify-between py-3 border-b last:border-0 hover:bg-accent/50 px-2 rounded transition-colors cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{file.name}</span>
      </div>
    </div>
  );
};

// Category File Item Component
const CategoryFileItem = ({ 
  file, 
  categoryId, 
  onRemove 
}: { 
  file: UploadedFile; 
  categoryId: string; 
  onRemove: (categoryId: string, fileId: string) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    const dragData: DragData = { file, fromCategory: categoryId };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex bg-white items-center justify-between rounded px-3 py-2 cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{file.name}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5"
        onClick={() => onRemove(categoryId, file.id)}
      >
        <X className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  );
};

// Drop Zone Category Component
const CategoryDropZone = ({ 
  category, 
  onDrop, 
  onRemove,
  hasError = false,
}: { 
  category: Category; 
  onDrop: (categoryId: string, file: UploadedFile, fromCategory: string | null) => void;
  onRemove: (categoryId: string, fileId: string) => void;
  hasError?: boolean;
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const dragData: DragData = JSON.parse(data);
      onDrop(category.id, dragData.file, dragData.fromCategory);
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  return (
    <Card 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-4 transition-colors ${
        hasError
          ? 'bg-red-50 border-red-300'
          : isOver
            ? 'border-primary border-2 bg-primary/5'
            : 'bg-blue-50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-primary">{category.name}</h3>
          {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
        </div>
        <div className="text-xs text-muted-foreground">
          {category.files.length} {category.files.length === 1 ? 'file' : 'files'}
        </div>
      </div>

      {hasError && category.files.length === 0 && (
        <p className="text-xs text-red-600 mb-2">At least one file is required</p>
      )}

      {category.files.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground italic">
            Drop files here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {category.files.map((file) => (
            <CategoryFileItem
              key={file.id}
              file={file}
              categoryId={category.id}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

const OrganiseUploads = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: '1', name: 'Client_Contracts_Q3' },
    { id: '2', name: 'Financial_Report_2024' },
    { id: '3', name: 'Inventory_Data_Current' },
    { id: '4', name: 'Sales_Figures_December' },
    { id: '5', name: 'Marketing_Campaign_Results' },
    { id: '6', name: 'Customer_Feedback_2024' },
    { id: '7', name: 'Product_Review_2024' },
    { id: '8', name: 'Market_Analysis_2024' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'vendor-master',
      name: 'Vendor Master',
      files: [
        { id: 'c1', name: 'Marketing_Campaign_Results' },
        { id: 'c2', name: 'Vendor_List_2024' },
      ],
    },
    { id: 'purchase-register', name: 'Purchase Register', files: [] },
    { id: 'customer-master', name: 'Customer Master', files: [] },
    { id: 'inventory-master', name: 'Inventory Master', files: [] },
    {
      id: 'invoice-register',
      name: 'Invoice Register',
      files: [{ id: 'c3', name: 'Invoice_Data_2024' }],
    },
    { id: 'po-summary', name: 'PO Summary', files: [] },
  ]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileDrop = (categoryId: string, file: UploadedFile, fromCategory: string | null) => {
    // Clear validation errors when file is dropped
    setValidationErrors([]);

    // If file is being moved from another category, remove it from there first
    if (fromCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === fromCategory
            ? { ...cat, files: cat.files.filter((f) => f.id !== file.id) }
            : cat,
        ),
      );
    } else {
      // If file is from uploaded files list, remove it from there
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
    }

    // Add file to the target category (check for duplicates)
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              files: cat.files.some((f) => f.id === file.id)
                ? cat.files
                : [...cat.files, { ...file, id: `${Date.now()}-${file.id}` }],
            }
          : cat,
      ),
    );
  };

  const removeFileFromCategory = (categoryId: string, fileId: string) => {
    const fileToRemove = categories
      .find((cat) => cat.id === categoryId)
      ?.files.find((f) => f.id === fileId);

    if (fileToRemove) {
      // Remove from category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, files: cat.files.filter((f) => f.id !== fileId) } : cat,
        ),
      );

      // Add back to uploaded files if it's not already there
      const originalId = fileToRemove.id.split('-').pop() || fileToRemove.id;
      if (!uploadedFiles.some((f) => f.id === originalId || f.name === fileToRemove.name)) {
        setUploadedFiles((prev) => [...prev, { ...fileToRemove, id: originalId }]);
      }

      // Clear validation on file removal (user is still editing)
      setValidationErrors([]);
    }
  };

  const onSubmit = async () => {
    try {
      // Validate categories
      const emptyCategories = categories.filter((cat) => cat.files.length === 0).map((cat) => cat.name);
      
      if (emptyCategories.length > 0) {
        setValidationErrors(emptyCategories);
        return;
      }

      // If valid, show validating UI then navigate
      setValidationErrors([]);
      setIsValidating(true);
      // simulate validation time (2s), blur applied via isValidating
      setTimeout(() => {
        setIsValidating(false);
        navigate('../../procedure-review');
      }, 2000);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card py-4 pr-4">
        <div className="flex items-center justify-between mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Organise Your Uploads</h1>
              <p className="text-sm text-muted-foreground">
                Drag and drop files into their correct categories for accurate mapping
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg"className='hover:cursor-pointer' onClick={() => navigate(-1)}>Previous</Button>
            <Button size="lg" onClick={onSubmit} className='hover:cursor-pointer'>Proceed</Button>
          </div>
        </div>
      </header>

      <div className={`mx-auto p-4 ${isValidating ? 'filter blur-sm pointer-events-none' : ''}`}>
        <div className="grid grid-cols-4 gap-4">
          {/* Left Column - Uploaded Files */}
          <Card className="p-6 col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-foreground">Uploaded Files</h2>
              <span className="w-6 h-6 flex justify-center items-center text-sm rounded-full p-1 bg-blue-100 text-blue-700">
                {uploadedFiles.length}
              </span>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground py-2 border-b">
                <span className="flex-1">File Name</span>
              </div>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <DraggableFile key={file.id} file={file} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic py-4 text-center">
                  {searchQuery ? 'No files match your search' : 'All files categorised'}
                </p>
              )}
            </div>
          </Card>

          {/* Right Column - Categorise Files */}
          <Card className="col-span-3 p-6">
            <h2 className="text-lg font-semibold text-foreground">Categorise Files</h2>
            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-700">
                <p className="font-medium">Please assign files to the following categories:</p>
                <ul className="list-disc list-inside mt-1">
                  {validationErrors.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => {
                const hasError = validationErrors.includes(category.name);
                return (
                  <CategoryDropZone
                    key={category.id}
                    category={category}
                    onDrop={handleFileDrop}
                    onRemove={removeFileFromCategory}
                    hasError={hasError}
                  />
                );
              })}
            </div>
          </Card>
        </div>
      </div>
      {/* Bottom validating bar */}
      {isValidating && (
        <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none bg-blue-100">
          <div className="w-full">
            <div className="rounded-t-md overflow-hidden shadow-lg pointer-events-auto">
              <div className="bg-white/90 backdrop-blur-sm">
                <div className="h-12 flex items-center justify-center">
                  <span className="text-base font-semibold text-blue-700">Validating Data...</span>
                </div>
                <div className="h-1 bg-gray-200">
                  <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganiseUploads;