// src/infrastructure/adapters/pdf_export.adapter.ts
import { Injectable } from '@nestjs/common';
import { ExportAdapter} from '@domain/Ports/export_adapter';
import PDFDocument from 'pdfkit';
import { ColumnDefinition, ExportOptions } from '@domain/Ports/export_types';

@Injectable()
export class PdfExportAdapter extends ExportAdapter {
  async export(data: any[], options: ExportOptions): Promise<Buffer> {
    this.validateOptions(options);
    const processedData = this.preprocessData(data, options);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
        layout: options.orientation || 'portrait',
        info: {
          Title: options.title,
          Author: 'K-Pop Management System',
          Subject: 'Reporte generado automáticamente',
          CreationDate: new Date(),
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Encabezado
      this.renderHeader(doc, options);
      
      // Metadatos
      this.renderMetadata(doc, options, processedData.length);
      
      // Gráficos (antes de la tabla)
      if (options.includeCharts && options.chartConfig) {
        const chartsBefore = options.chartConfig.filter(c => c.position !== 'after');
        chartsBefore.forEach((chart: any) => {
          this.renderChartPlaceholder(doc, chart);
        });
      }

      // Tabla principal
      this.renderTable(doc, processedData, options.columns);
      
      // Gráficos (después de la tabla)
      if (options.includeCharts && options.chartConfig) {
        const chartsAfter = options.chartConfig.filter(c => c.position === 'after');
        chartsAfter.forEach(chart => {
          this.renderChartPlaceholder(doc, chart);
        });
      }

      // Pie de página
      this.renderFooter(doc);
      
      doc.end();
    });
  }

  private renderHeader(doc: PDFKit.PDFDocument, options: ExportOptions): void {
    // Logo (opcional)
    // doc.image('logo.png', 30, 20, { width: 50 });
    
    // Título
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text(options.title, { align: 'center' });
    
    // Línea decorativa
    doc.moveTo(30, 70)
       .lineTo(doc.page.width - 30, 70)
       .lineWidth(2)
       .strokeColor('#FF4081')
       .stroke();
    
    doc.moveDown(2);
  }

  private renderMetadata(doc: PDFKit.PDFDocument, options: ExportOptions, recordCount: number): void {
  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#666666');
  
  // Función helper para renderizar líneas de forma segura
  const renderMetadataLine = (text: string | null | undefined) => {
    if (text && text.trim().length > 0) {
      doc.text(text, { align: 'left', indent: 30 });
    }
  };

  // Renderizar cada línea
  renderMetadataLine(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`);
  renderMetadataLine(`Total de registros: ${recordCount}`);
  
  if (options.filters) {
    const filtersText = this.safeStringify(options.filters);
    if (filtersText && filtersText !== '{}') {
      renderMetadataLine(`Filtros aplicados: ${filtersText}`);
    }
  }
  
  if (options.sortBy) {
    const direction = options.sortDirection === 'desc' ? 'descendente' : 'ascendente';
    renderMetadataLine(`Ordenado por: ${options.sortBy} (${direction})`);
  }
  
  doc.moveDown(1);
}

private safeStringify(obj: any): string | null {
  try {
    if (!obj) return null;
    const str = JSON.stringify(obj);
    return str === '{}' || str === '[]' ? null : str;
  } catch {
    return null;
  }
}

  private renderTable(doc: PDFKit.PDFDocument, data: any[], columns: ColumnDefinition[]): void {
    if (data.length === 0) {
      doc.fontSize(12)
         .fillColor('#999999')
         .text('No hay datos para mostrar', { align: 'center' });
      return;
    }

    const tableTop = doc.y;
    const rowHeight = 25;
    const pageWidth = doc.page.width - 60;
    
    // Calcular anchos de columnas
    const columnWidths = this.calculateColumnWidths(columns, pageWidth);
    
    // Encabezados
    doc.font('Helvetica-Bold').fontSize(11);
    let x = 30;
    
    columns.forEach((col, i) => {
      doc.rect(x, tableTop, columnWidths[i], rowHeight)
         .fillAndStroke('#F5F5F5', '#DDDDDD');
      
      doc.fillColor('#333333')
         .text(col.header, x + 5, tableTop + 7, {
           width: columnWidths[i] - 10,
           align: col.align || 'left',
         });
      
      x += columnWidths[i];
    });

    // Filas de datos
    doc.font('Helvetica').fontSize(10);
    
    data.forEach((row, rowIndex) => {
      const y = tableTop + rowHeight + (rowIndex * rowHeight);
      
      // Alternar colores de fondo
      const bgColor = rowIndex % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
      
      let x = 30;
      columns.forEach((col, colIndex) => {
        // Fondo de celda
        doc.rect(x, y, columnWidths[colIndex], rowHeight)
           .fill(bgColor);
        
        // Borde
        doc.rect(x, y, columnWidths[colIndex], rowHeight)
           .stroke('#EEEEEE');
        
        // Valor
        let value = row[col.field] ?? '';
        
        // Aplicar formatter si existe
        if (col.formatter) {
          value = col.formatter(value);
        }
        
        // Aplicar renderer si existe
        if (col.renderer) {
          value = col.renderer(value, row);
        }
        
        doc.fillColor('#000000')
           .text(String(value), x + 5, y + 7, {
             width: columnWidths[colIndex] - 10,
             align: col.align || 'left',
             ellipsis: true, // Para texto largo
           });
        
        x += columnWidths[colIndex];
      });

      // Salto de página si es necesario
      if (y + rowHeight > doc.page.height - 50) {
        doc.addPage();
        doc.y = 30;
      }
    });
    
    doc.moveDown(2);
  }

  private renderChartPlaceholder(doc: PDFKit.PDFDocument, chart: any): void {
    doc.fontSize(12)
       .fillColor('#333333')
       .text(`Gráfico: ${chart.title}`, { align: 'center' });
    
    doc.rect(50, doc.y, doc.page.width - 100, 150)
       .fill('#F9F9F9')
       .stroke('#DDDDDD');
    
    doc.fontSize(10)
       .fillColor('#888888')
       .text(`[Gráfico ${chart.type} se generaría aquí]`, 
             50 + (doc.page.width - 100) / 2, 
             doc.y + 70, 
             { align: 'center', width: doc.page.width - 100 });
    
    doc.moveDown(4);
  }

  private renderFooter(doc: PDFKit.PDFDocument): void {
    const pageCount = doc.bufferedPageRange().count;
    
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .fillColor('#888888')
         .text(
           `Sistema de Gestión K-Pop • Página ${i + 1} de ${pageCount} • ${new Date().toLocaleDateString()}`,
           30,
           doc.page.height - 30,
           { align: 'center', width: doc.page.width - 60 }
         );
    }
  }

  private calculateColumnWidths(columns: ColumnDefinition[], totalWidth: number): number[] {
    const fixedWidthColumns = columns.filter(c => c.width);
    const totalFixedWidth = fixedWidthColumns.reduce((sum, c) => sum + (c.width || 0), 0);
    
    const remainingWidth = totalWidth - totalFixedWidth;
    const flexibleColumns = columns.filter(c => !c.width);
    const flexibleWidth = flexibleColumns.length > 0 ? remainingWidth / flexibleColumns.length : 0;
    
    return columns.map(col => col.width || flexibleWidth);
  }

  protected preprocessData(data: any[], options: ExportOptions): any[] {
    // Ordenar datos si se especificó
    if (this.options?.sortBy) {
      return [...data].sort((a, b) => {
        const aVal = a[options.sortBy!] ?? ''; 
        const bVal = b[options.sortBy!] ?? '';
        
        if (this.options.sortDirection === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }
    return data;
  }
  
  private options!: ExportOptions;
}