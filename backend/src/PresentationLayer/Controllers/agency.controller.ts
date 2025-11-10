// presentation/Controllers/AgencyController.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  ParseUUIDPipe 
} from '@nestjs/common';

@Controller('agencies')
export class AgencyController {
  constructor() {}

}