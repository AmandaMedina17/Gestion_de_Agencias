import { PartialType } from "@nestjs/mapped-types";
import { CreateApprenticeDto } from "./create-apprentice.dto";

export class UpdateApprenticeDto extends PartialType(CreateApprenticeDto){}