// src/domain/ports/export.types.ts
export abstract class ExportOptions {
  abstract title: string;
  abstract columns: ColumnDefinition[];
  orientation?: 'portrait' | 'landscape';
  includeCharts?: boolean;
  chartConfig?: ChartConfig[];
  filters?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export abstract class ColumnDefinition {
  abstract header: string;
  abstract field: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  renderer?: (value: any, row?: any) => string;
  formatter?: (value: any) => any;
}

export abstract class ChartConfig {
  abstract type: 'bar' | 'line' | 'pie' | 'doughnut';
  abstract data: any[];
  abstract title: string;
  labels?: string[];
  width?: number;
  height?: number;
  position?: 'before' | 'after';
}

export abstract class ExportResult {
  abstract buffer: Buffer;
  abstract filename: string;
  abstract mimeType: string;
}