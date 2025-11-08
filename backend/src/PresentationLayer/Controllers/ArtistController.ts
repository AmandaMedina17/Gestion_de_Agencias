// // presentation/controllers/ArtistController.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
// import { ArtistService } from '../../../application/agency/services/ArtistService';
// import { CreateArtistUseCase } from '../../../application/artist/use-cases/CreateArtistUseCase';
import { Artist } from '../../DomainLayer/Entities/Artist';

@Controller('artist')
export class ArtistController {
  constructor(
    // private readonly artistService: ArtistService,
    // private readonly createArtistUseCase: CreateArtistUseCase
  ) {}
}