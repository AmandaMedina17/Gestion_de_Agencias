// // presentation/controllers/ApprenticeController.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
// import { ApprenticeService } from '../../../application/agency/services/ApprenticeService';
// import { CreateAppenticeUseCase } from '../../../application/apprentice/use-cases/CreateApprenticeUseCase';
import { Apprentice } from '../../DomainLayer/Entities/Apprentice';

@Controller('apprentices')
export class ApprenticeController {
  constructor(
    // private readonly apprenticeService: ApprenticeService,
    // private readonly createApprenticeUseCase: CreateApprenticeUseCase
  ) {}
}