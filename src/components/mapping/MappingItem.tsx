import { cn } from '@/lib/utils';
import type { MappingItem as MappingItemType } from '@/types/canvas.types';
import { Sparkle, ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface MappingItemProps {
  item: MappingItemType;
  onDrop: (
    itemId: string,
    columnData: { nodeId: string; nodeLabel: string; columnId: string; columnName: string },
  ) => void;
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

  // Determine color based on mapping type and confidence
  const getColorClasses = () => {
    if (!isMapped) {
      return 'bg-purple-200/30 border-purple-500/50 text-purple-500';
    }

    // User mapped = always green
    if (item.mappingType === 'user') {
      return 'bg-green-50 border-green-500/70 text-green-800';
    }

    // AI mapped = based on confidence score
    const confidence = item.confidenceScore || 0;

    if (confidence > 80) {
      return 'bg-green-50 border-green-500/70 text-green-800';
    } else if (confidence >= 50) {
      return 'bg-yellow-50 border-yellow-500/70 text-yellow-800';
    } else {
      return 'bg-orange-50 border-orange-500/70 text-orange-800';
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger className='w-full flex flex-col'>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'px-4 py-3 rounded-lg border transition-all cursor-default relative w-full',
              getColorClasses(),
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium mt-2">{item.name}</span>
              {isMapped && item.mappingType === 'ai' ? (
                <span className="absolute left-0 top-0 text-xs px-2 py-0.5 rounded-tl-md rounded-br-md bg-purple-500 text-white">
                  <Sparkle className="inline-block size-3 mr-1 text-yellow-200" />
                </span>
              ) : null}
              {isMapped ? (
                <div className="flex flex-col items-end gap-1 mt-2">
                  <span className="text-sm"><ArrowRight className="inline-block size-3 mr-1" /> {item.mappedColumn?.columnName}</span>
                </div>
              ) : (
                <span className="text-sm opacity-80">—</span>
              )}
            </div>
          </div>
        </TooltipTrigger>
        {isMapped && item.mappingType === 'ai' && (
          <TooltipContent>
            <p>Confidence Score: {item.confidenceScore}%</p>
          </TooltipContent>
        )}
      </Tooltip>
    </>
  );
};

export default MappingItem;
