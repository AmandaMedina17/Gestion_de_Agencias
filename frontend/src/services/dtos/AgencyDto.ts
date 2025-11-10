export interface CreateAgencyDto{
    name: string;
    ubication: string;
    fundationDate: Date;


}

export interface AgencyResponseDto{
    id: string;
    name:string;
    ubication: string;
    fundationDate: Date;
}