import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ArtistRole } from '@domain/Enums';

export class AddMemberToGroupDto {
  @IsUUID()
  @IsNotEmpty()
  groupId!: string;

  @IsNotEmpty()
  @IsUUID()
  artistId!: string;

  @IsNotEmpty()
  @IsEnum(ArtistRole)
  role!: ArtistRole;

}