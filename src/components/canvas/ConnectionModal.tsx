import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import type { ColumnItem } from '@/types/canvas.types';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sourceColumnId: string, targetColumnId: string) => void;
  sourceNode: { label: string; columns: ColumnItem[] } | null;
  targetNode: { label: string; columns: ColumnItem[] } | null;
}

const ConnectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  sourceNode,
  targetNode,
}: ConnectionModalProps) => {
  const [sourceColumn, setSourceColumn] = useState<string>('');
  const [targetColumn, setTargetColumn] = useState<string>('');

  useEffect(() => {
    if (isOpen && sourceNode?.columns.length && targetNode?.columns.length) {
      setSourceColumn(sourceNode.columns[0].id);
      setTargetColumn(targetNode.columns[0].id);
    }
  }, [isOpen, sourceNode, targetNode]);

  const handleConfirm = () => {
    if (sourceColumn && targetColumn) {
      onConfirm(sourceColumn, targetColumn);
      onClose();
    }
  };

  if (!sourceNode || !targetNode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Connect Columns
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label className="text-muted-foreground">
              Source: <span className="text-primary">{sourceNode.label}</span>
            </Label>
            <Select value={sourceColumn} onValueChange={setSourceColumn}>
              <SelectTrigger className="bg-gray-100 border-border">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {sourceNode.columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    <span className="font-mono">{col.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({col.type})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-8 w-px bg-border" />
            <span className="px-3 text-muted-foreground text-sm">connects to</span>
            <div className="h-8 w-px bg-border" />
          </div>
          <div className="grid gap-2">
            <Label className="text-muted-foreground">
              Target: <span className="text-primary">{targetNode.label}</span>
            </Label>
            <Select value={targetColumn} onValueChange={setTargetColumn}>
              <SelectTrigger className="bg-gray-100 border-border">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {targetNode.columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    <span className="font-mono">{col.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({col.type})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionModal;
