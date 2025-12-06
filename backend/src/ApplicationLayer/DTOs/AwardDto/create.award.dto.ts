import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateAwardDto{
      
    @IsNotEmpty()
    @IsString()
    name!: string
    
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) 
    date!: Date

    @IsOptional()
    @IsString()
    albumId?: string 
 
}  