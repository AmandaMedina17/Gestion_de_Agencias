import { PartialType } from '@nestjs/mapped-types';
import { CreateResponsibleDto } from '../responsibleDto/create-responsible.dto';

export class UpdateResponsibleDto extends PartialType(CreateResponsibleDto) {}
