import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, FileSpreadsheet, X } from 'lucide-react';

type UploadFilesProps = {
  tab: string;
};

const STORAGE_KEY = 'step2';

function mapTabToKey(tab: string): 'p2p_files' | 'h2r_files' | 'o2c_files' | null {
  switch ((tab || '').toUpperCase()) {
    case 'P2P':
      return 'p2p_files';
    case 'H2R':
      return 'h2r_files';
    case 'O2C':
      return 'o2c_files';
    default:
      return null;
  }
}

const ensureInitial = (raw: any) => {
  if (!raw) return { p2p_files: [], h2r_files: [], o2c_files: [] };
  return {
    p2p_files: Array.isArray(raw.p2p_files) ? raw.p2p_files : [],
    h2r_files: Array.isArray(raw.h2r_files) ? raw.h2r_files : [],
    o2c_files: Array.isArray(raw.o2c_files) ? raw.o2c_files : [],
  };
};

const UploadFiles: React.FC<UploadFilesProps> = ({ tab }) => {
  const storageKey = mapTabToKey(tab);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const data = ensureInitial(raw ? JSON.parse(raw) : null);
      if (storageKey) setFiles(data[storageKey]);
    } catch (e) {
      // ignore
    }
  }, [tab]);

  const onDrop = (accepted: File[]) => {
    if (!storageKey || !accepted || accepted.length === 0) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const data = ensureInitial(raw ? JSON.parse(raw) : null);
      const incoming = accepted.map((f) => f.name);
      const merged = Array.from(new Set([...(data[storageKey] || []), ...incoming]));
      data[storageKey] = merged;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setFiles(merged);
    } catch (e) {
      // ignore
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="bg-card rounded-lg border p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Upload Files</h3>
        <p className="text-sm text-muted-foreground">Drag and drop your files or browse to upload</p>
      </div>

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
            <p className="text-sm text-muted-foreground mb-4">Upload CSV, Excel, or JSON files to get started</p>
            <Button
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              Browse Files
            </Button>
          </div>
        </div>

      </div>

      {/* Show uploaded files outside the drop area */}
      {files && files.length > 0 && (
        <div className="mt-3 flex gap-3 flex-wrap">
          {files.map((name, idx) => {
            // Use Excel icon for all file types (including CSV and others) per request
            const FileIcon = FileSpreadsheet;
            return (
              <span
                key={name + idx}
                className="inline-flex items-center gap-2 px-2 py-1 bg-white border border-gray-200 p-4 rounded-lg text-sm text-blue-700"
                title={name}
              >
                <FileIcon className="w-8 h-8" />
                <span className="truncate">{name}</span>
                <X className="w-8 h-8 text-gray-500" />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
