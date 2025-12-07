// src/application/abstract/base-report.service.ts
import { Injectable } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportOptions, ColumnDefinition, ExportResult } from '@domain/Ports/export_types';

@Injectable()
export abstract class BaseReportService {
  constructor(protected readonly exportService: ExportService) {}

  abstract getData(filters: any): Promise<any[]>;
  abstract getColumns(): ColumnDefinition[];
  abstract getDefaultTitle(): string;

  // Método template para generar reportes
  async generate(filters: any, customOptions?: Partial<ExportOptions>): Promise<ExportResult> {
    // 1. Obtener datos
    const data = await this.getData(filters);
    
    // 2. Configurar columnas
    const columns = this.getColumns();
    
    // 3. Crear opciones
    const options = this.exportService.createExportOptions(
      customOptions?.title || this.getDefaultTitle(),
      columns,
      {
        filters,
        ...customOptions,
      }
    );
    
    // 4. Generar reporte
    return this.exportService.generateReport(data, options);
  }

  // Método para ordenar datos
  protected sortData(data: any[], sortBy: string, sortDirection: 'asc' | 'desc' = 'asc'): any[] {
    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortDirection === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
  }

  // Método para paginar datos (si es necesario)
  protected paginateData(data: any[], page: number, pageSize: number): any[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }
}