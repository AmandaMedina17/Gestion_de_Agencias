import { ExportOptions } from './export_types';

export abstract class ExportAdapter<T = any> {
  abstract export(data: T[], options: ExportOptions): Promise<Buffer>;
  
  // Métodos auxiliares que pueden ser sobrescritos
  protected preprocessData(data: T[], options: ExportOptions): any[] {
    return data;
  }
  
  protected validateOptions(options: ExportOptions): void {
    if (!options.title) throw new Error('Title is required');
    if (!options.columns || options.columns.length === 0) {
      throw new Error('At least one column must be defined');
    }
  }
}