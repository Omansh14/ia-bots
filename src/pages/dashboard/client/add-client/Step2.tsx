import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Upload,
  CloudUpload,
  Database,
  FileUp,
  Link,
  CircleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type DataSource = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
};

const UploadData = () => {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState('file-upload');
  const [activeTab, setActiveTab] = useState('P2P');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file);
    }
  };

  const { getInputProps, getRootProps, acceptedFiles, open } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: true,
    noKeyboard: true,
    noClick:true
  });

  const dataSources: DataSource[] = [
    {
      id: 'file-upload',
      icon: <Upload className="p-1 rounded-sm bg-blue-100 text-primary" />,
      title: 'File Upload',
      description: 'Upload CSV, Excel, or JSON files',
      selected: true,
    },
    {
      id: 'cloud-storage',
      icon: <CloudUpload className="bg-green-100 text-green-600 rounded-sm p-1" />,
      title: 'Cloud Storage',
      description: 'Connect to Google Drive, Dropbox',
    },
    {
      id: 'database',
      icon: <Database className="bg-purple-100 text-purple-600 rounded-sm p-1" />,
      title: 'Database',
      description: 'MySQL, PostgreSQL, MongoDB',
    },
    {
      id: 'third-party',
      icon: <Link className="bg-yellow-100 text-yellow-600 rounded-sm p-1" />,
      title: 'Third Party',
      description: 'APIs, webhooks, integrations',
    },
  ];

  const handleSubmit = () => {
    navigate('../organise-upload');
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <header className="border-b bg-card pr-4 py-2">
        <div className="flex items-center justify-between mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Upload Data</h1>
              <p className="text-sm text-muted-foreground">
                Upload the data files and document evidence your bots need to get started
              </p>
            </div>
          </div>
          <Button size="lg" onClick={handleSubmit}>Save & Next</Button>
        </div>
      </header>

      <div className="flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card px-2 py-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">Data Sources</h2>
            <p className="text-xs text-muted-foreground">Choose how to import your data</p>
          </div>
          <div className="space-y-1">
            {dataSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:cursor-pointer ${
                  selectedSource === source.id ? 'border border-primary/50' : 'hover:bg-accent'
                }`}
              >
                <div
                  className={`mt-0.5 ${
                    selectedSource === source.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {source.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium ${
                      selectedSource === source.id ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {source.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{source.description}</div>
                </div>
              </button>
            ))}
            <div className="w-full flex items-start gap-3 p-3 rounded-lg text-left bg-amber-100">
              <div className="mt-0.5">
                <CircleAlert className='w-4 h-4 text-gray-700' />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700">Quick Start</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Upload a file to begin data processing and mapping
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="p-1 bg-white">
              <TabsTrigger value="P2P">P2P</TabsTrigger>
              <TabsTrigger value="H2R">H2R</TabsTrigger>
              <TabsTrigger value="O2C">O2C</TabsTrigger>
              <TabsTrigger value="Master">Master</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Upload Files Section */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your files or browse to upload
              </p>
            </div>

            {/* Drag and Drop Area */}
            <div
              className="relative border-2 border-dashed rounded-lg p-6 h-64 text-center bg-muted/30 hover:bg-muted/50 transition-colors"
              {...getRootProps()}
            >
              <div className="flex flex-col items-center gap-4">
                <Input type="file" {...getInputProps()} />
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Drag and Drop</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload CSV, Excel, or JSON files to get started
                  </p>
                  <Button className='hover:cursor-pointer' onClick={(e) => { e.stopPropagation(); open()}}>Browse Files</Button>
                </div>
              </div>
              {acceptedFiles && acceptedFiles.length> 0 &&(
                <div className="absolute bottom-2 flex gap-3">
                  {acceptedFiles.map(file => <Badge className='bg-blue-100 text-blue-600 text-xs'>{file.name}</Badge>)}
                </div>
              )}
            </div>
          </div>

          {/* Document Evidence Section */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Document Evidence
            </h3>

            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="relative">
                  <Label htmlFor="pan-certificate" className="text-sm font-medium mb-2 block">
                    PAN certificate
                  </Label>
                  <span className="text-gray-500 font-normal cursor-pointer absolute right-2 top-1 text-xs">
                    Prevent duplicate vendors
                  </span>
                  <div className="border rounded-lg py-2 px-4 flex items-center justify-between bg-muted/30">
                    <span className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : 'Upload File'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById('pan-certificate')?.click()}
                      type="button"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    id="pan-certificate"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="relative">
                  <Label htmlFor="pan-certificate" className="text-sm font-medium mb-2 block">
                    Ghost employee detection
                  </Label>
                  <span className="text-gray-500 font-normal cursor-pointer absolute right-2 top-1 text-xs">
                    GST Certificate
                  </span>
                  <div className="border rounded-lg py-2 px-4 flex items-center justify-between bg-muted/30">
                    <span className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : 'Upload File'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById('pan-certificate')?.click()}
                      type="button"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    id="pan-certificate"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadData;
