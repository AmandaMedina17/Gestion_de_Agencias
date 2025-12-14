import { IsNotEmpty, IsISO8601, IsOptional, IsString } from 'class-validator';

export class ArtistIncomeDto {
  @IsNotEmpty()
  @IsString()
  artistId!: string;

  @IsOptional()
  @IsISO8601()
  start_date!: Date;

  @IsOptional()
  @IsISO8601()
  end_date!: Date;
}