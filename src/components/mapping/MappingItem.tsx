import { cn } from '@/lib/utils';
import type { MappingItem as MappingItemType } from '@/types/canvas.types';

interface MappingItemProps {
  item: MappingItemType;
  onDrop: (itemId: string, columnData: { nodeId: string; nodeLabel: string; columnId: string; columnName: string }) => void;
}

const MappingItem = ({ item, onDrop }: MappingItemProps) => {
  const isMapped = !!item.mappedColumn;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
    
    const columnData = e.dataTransfer.getData('application/column');
    if (columnData) {
      try {
        const parsed = JSON.parse(columnData);
        onDrop(item.id, parsed);
      } catch (err) {
        console.error('Failed to parse column data:', err);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'px-4 py-3 rounded-lg border transition-all cursor-default',
        isMapped
          ? 'bg-emerald-500/10 border-emerald-500/40 text-green-600'
          : 'bg-purple-200/30 border-purple-500/50 text-purple-500'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{item.name}</span>
        {isMapped ? (
          <span className="text-sm">
            — {item.mappedColumn?.columnName}
          </span>
        ) : (
          <span className="text-sm opacity-80">—</span>
        )}
      </div>
    </div>
  );
};

export default MappingItem;
