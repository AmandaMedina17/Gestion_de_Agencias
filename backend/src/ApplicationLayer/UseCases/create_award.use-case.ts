import { CreateAwardDto } from "@application/DTOs/AwardDto/create.award.dto";
import { Award } from "@domain/Entities/Award";
import { IAlbumRepository } from "@domain/Repositories/IAlbumRepository";
import { IAwardRepository } from "@domain/Repositories/IAwardRepository";
import { Injectable } from "@nestjs/common";

// @Injectable()
// class CreateAwardUseCase{
//     constructor(
//         private readonly albumRepository :IAlbumRepository,
//         private readonly awardRepository :IAwardRepository
//     ) {}

//     async execute(dto : CreateAwardDto){
//         const album = await this.albumRepository.findById(dto.albumId!);

//         const award = Award.create(dto.name, dto.date, album.id

//         )
//     }
// }