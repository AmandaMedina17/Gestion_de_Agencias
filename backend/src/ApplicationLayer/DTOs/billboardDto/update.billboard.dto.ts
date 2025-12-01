import { PartialType } from "@nestjs/mapped-types";
import { CreateBillBoardListDto } from "./create.billboard.dto";

export class UpdateBillboardListDto extends PartialType(CreateBillBoardListDto){}