import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AppendConfirmModalProps {
  isOpen: boolean;
  sourceLabel: string;
  targetLabel: string;
  onAppend: () => void;
  onMapInstead: () => void;
  onClose: () => void;
}

const AppendConfirmModal = ({
  isOpen,
  sourceLabel,
  targetLabel,
  onAppend,
  onMapInstead,
  onClose,
}: AppendConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Append Sheets?</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-muted-foreground text-sm">
          Do you want to append{' '}
          <span className="text-primary font-semibold">{sourceLabel}</span> and{' '}
          <span className="text-primary font-semibold">{targetLabel}</span> together?
          <p className="mt-2 text-xs text-muted-foreground">
            Choosing <strong>No</strong> will let you map columns instead.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onMapInstead}>
            No, Map Columns
          </Button>
          <Button onClick={onAppend}>
            Yes, Append
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppendConfirmModal;