// src/application/services/export.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ExportAdapter } from '@domain/Ports/export_adapter';
import { ColumnDefinition, ExportOptions, ExportResult } from '@domain/Ports/export_types';

@Injectable()
export class ExportService {
  constructor(
    @Inject(ExportAdapter) 
    private readonly exportAdapter: ExportAdapter,
  ) {}

  async generateReport(
    data: any[],
    options: ExportOptions,
    format: 'pdf' | 'excel' = 'pdf',
  ): Promise<ExportResult> {
    // Aqui se puede agregar lógica para diferentes formatos
    // Por ahora solo PDF
    
    const buffer = await this.exportAdapter.export(data, options);
    
    // Generar nombre de archivo único
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTitle = options.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeTitle}-${timestamp}.pdf`;
    
    return {
      buffer,
      filename,
      mimeType: 'application/pdf',
    };
  }

  // Método auxiliar para crear opciones estándar
  createExportOptions(
    title: string,
    columns: ColumnDefinition[],
    additionalOptions: Partial<ExportOptions> = {},
  ): ExportOptions {
    return {
      title,
      columns,
      orientation: 'landscape',
      ...additionalOptions,
    };
  }
}