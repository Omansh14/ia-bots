export interface ColumnItem {
  id: string;
  name: string;
  type: string;
}

export interface SheetNodeData extends Record<string, unknown> {
  label: string;
  columns: ColumnItem[];
}

export interface MappingItem {
  id: string;
  name: string;
  mappingType?: 'user' | 'ai';
  confidenceScore?: number; // 0-100, only for AI mappings
  mappedColumn?: {
    nodeId: string;
    nodeLabel: string;
    columnId: string;
    columnName: string;
  };
}
