import { PartialType } from "@nestjs/swagger";
import { CreateBillBoardListDto } from "./create.billboard.dto";

export class UpdateBillboardListDto extends PartialType(CreateBillBoardListDto){}