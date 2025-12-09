// Controlador SIMPLIFICADO sin Swagger
import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('export')
export class ExportController {
  constructor(
    // private readonly activeArtistsReportService: ActiveArtistsReportService,
  ) {}

//   @Get('active-artists')
//   async exportActiveArtists(
//     @Query('agencyId') agencyId?: string,
//     @Query('status') status?: string,
//     @Query('sortBy') sortBy?: string,
//     @Query('sortDirection') sortDirection?: 'asc' | 'desc',
//     @Res() res: Response,
//   ) {
//     try {
//       const filters = { agencyId, status, sortBy, sortDirection };
//       const result = await this.activeArtistsReportService.generate(filters);

//       // Configurar headers para descarga
//       res.setHeader('Content-Type', result.mimeType);
//       res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      
//       // Enviar el buffer como archivo
//       res.send(result.buffer);
//     } catch (error) {
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: 'Error generando el reporte',
//         error: error.message,
//       });
//     }
//   }
}