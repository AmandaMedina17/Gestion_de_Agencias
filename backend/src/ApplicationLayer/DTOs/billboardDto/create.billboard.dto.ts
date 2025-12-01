import { BillboardList } from "@domain/Entities/BillboardList"
import { BillboardListScope } from "@domain/Enums"
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateBillBoardListDto {
      
   @IsNotEmpty()
   @IsDate()
   publicDate!: Date

   @IsNotEmpty()
   @IsEnum(BillboardListScope)
   scope!: BillboardListScope

   @IsNotEmpty()
   @IsString()
   nameList!: string

   @IsNotEmpty()
   @IsNumber()
   endList!:number

}
