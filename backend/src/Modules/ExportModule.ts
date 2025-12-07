// src/infrastructure/export/export.module.ts
import { Module, Global } from '@nestjs/common';
import { ExportService } from '@application/services/export.service';
import { PdfExportAdapter } from '@infrastructure/adapters/pdf_export.adapter';
import { ExportAdapter } from '@domain/Ports/export_adapter';

@Global()
@Module({
  providers: [
    ExportService,
    {
      provide: ExportAdapter,
      useClass: PdfExportAdapter,
    },
  ],
  exports: [ExportService, ExportAdapter],
})
export class ExportModule {}