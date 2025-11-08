import { IsNotEmpty, IsString } from "class-validator";

export class CreateResponsibleDto {
    @IsNotEmpty()
    @IsString()
    name!: string;
}

export class ResponsibleResponseDto {
  name!: string;
}