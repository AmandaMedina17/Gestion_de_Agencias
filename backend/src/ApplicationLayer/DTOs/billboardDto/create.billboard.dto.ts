import { BillboardListScope } from "../../../DomainLayer/Enums"
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateBillBoardListDto {
      
   @IsNotEmpty()
   @IsDate()
   @Transform(({ value }) => new Date(value)) //Convierte string a Date automáticamente
   publicDate!: Date

   @IsNotEmpty()
   @IsEnum(BillboardListScope)
   scope!: BillboardListScope

   @IsNotEmpty()
   @IsString()
   nameList!: string

   @IsNotEmpty()
   @IsNumber()
   @Transform(({ value }) => parseInt(value, 10))
   endList!:number

   

}
