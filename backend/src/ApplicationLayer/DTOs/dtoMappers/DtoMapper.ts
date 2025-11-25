import { UpdateData } from "@domain/UpdateData";

export abstract class BaseDtoMapper<Domain, CreateDto, ResponseDto> {
  abstract fromDto(dto: CreateDto): Domain;
  abstract toResponse(domain: Domain): ResponseDto;

  fromDtoList(dtos: CreateDto[]): Domain[] {
    return dtos.map((dto) => this.fromDto(dto));
  }

  toResponseList(domains: Domain[]): ResponseDto[] {
    return domains.map((d) => this.toResponse(d));
  }

  toDomainUpdate(updateDto: any): UpdateData {
    return updateDto; 
  }
}