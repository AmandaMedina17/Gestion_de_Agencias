import { ArtistRole, GroupStatus } from "../Enums";
import { v4 as uuidv4 } from 'uuid';
import { IUpdatable } from "@domain/UpdatableInterface";
import { UpdateData } from "@domain/UpdateData";

export class Group implements IUpdatable {
  
  private _members: string[] = [];

  constructor(
    private readonly id: string,
    private name: string,
    private status: GroupStatus,
    private debut_date: Date,
    private concept: string,
    private is_created: boolean,
    private agencyId: string,
    private num_members: number = 0,
    private visualConcept: string | null = null,
    private proposedByArtistId: string | null = null,
    members?: string[],
    
  ) {
    if (members) {
      this._members = members;
    }
    this.validate();
  }

  update(updateDto: UpdateData): void {

    if (updateDto.name) {
      this.validateName(updateDto.name)
      this.name = updateDto.name
    }

    if (updateDto.status) {
      this.updateStatus(updateDto.status as GroupStatus)
    }

    if (updateDto.debut_date){
      this.updateDebutDate(updateDto.debut_date)
    }

    if (updateDto.concept !== undefined) {
      this.validateConcept(updateDto.concept)
      this.concept = updateDto.concept
    }

    if (updateDto.is_created !== undefined) {
      this.updateCreationStatus(updateDto.is_created)
    }

    if (updateDto.agencyId) {
      this.agencyId = updateDto.agency_id
    }
  }

  private updateStatus(newStatus: GroupStatus): void {
    
    if (this.status === GroupStatus.DISUELTO && newStatus !== GroupStatus.DISUELTO) {
      throw new Error("Un grupo disuelto no puede reactivarse");
    }

    if (newStatus === GroupStatus.ACTIVO && this.getNumberOfMembers() < 2) {
      throw new Error("Un grupo activo debe tener al menos 2 miembros");
    }

    this.status = newStatus;
  }

    private updateCreationStatus(newStatus: boolean): void {
    
      if(this.is_created == true && newStatus == false){
        throw new Error("Un grupo ya creado no puede volver a estado 'no creado'");
      }

      this.is_created = newStatus;
  }

  private updateDebutDate(newDate: Date): void {

    // No permitir cambiar a una fecha futura si el grupo ya debutó
    const today = new Date();
    if (this.debut_date < today && newDate > today && this.is_created) {
      throw new Error("No se puede posponer la fecha de debut de un grupo que ya debutó");
    }

    this.debut_date = newDate;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error("El nombre del grupo debe tener al menos 2 caracteres");
    }
    if (name.length > 200) {
      throw new Error("El nombre del grupo no puede exceder 200 caracteres");
    }
    this.name = name.trim();
  }

  private validateConcept(newConcept: string): void {
    if (!newConcept || newConcept.trim().length === 0) {
      throw new Error("El concepto del grupo es requerido");
    }
  }

  private validate(): void {
      if (!this.id) {
        throw new Error("El ID del grupo es requerido");
      }

      this.validateName(this.name)
      
      this.validateConcept(this.concept)

      if (!this.agencyId || this.agencyId.length == 0) {
        throw new Error("El grupo debe tener una agencia que lo represente");
      }
  }

  static create( name: string, status: GroupStatus, debut_date: Date, 
    concept: string, is_created: boolean, agencyId: string, numberOfMember: number = 0, visualConcept: string | null = null, proposedByArtistId: string | null = null) : Group {
    const id = uuidv4();
    return new Group(id, name, status, debut_date, concept, is_created, agencyId,numberOfMember,visualConcept,proposedByArtistId);
  }

  // Método para agregar un miembro (con rol y fecha de inicio)
  public addMember(memberId: string, role: ArtistRole, startDate: Date = new Date()): MembershipInfo {

    // Validar que el miembro no esté ya en el grupo
    if (this._members.some(m => m === memberId)) {
      throw new Error("El miembro ya pertenece a este grupo");
    }

    // Validar que el miembro no esté ya en el grupo
    if (this.num_members >= 10) {
      throw new Error("La cantidad de miembros de un grupo no puede exceder 10");
    }

    // Agregar a la lista de miembros activos
    this._members.push(memberId);

    // Calcular fecha de debut
    // La fecha de debut es la mayor entre:
    // 1. La fecha de inicio de membresía
    // 2. La fecha de debut del grupo (si aún no ha debutado)
    const artist_debut_date = this.debut_date > startDate ? this.debut_date : startDate;
    
    // Actualizar cantidad de miembros del grupo
    this.num_members += 1

    //Retornar Membresía
    return {
      groupId: this.id,
      artistId: memberId,
      start_date: startDate,
      role: role,
      artistDebutDate: artist_debut_date
    };
    
  }

  // Método para remover un miembro (con fecha de salida y razón)
  public removeMember(memberId: string, leaveDate: Date = new Date()): void {

    const memberIndex = this._members.findIndex(m => m === memberId);
    
    if (memberIndex === -1) {
      throw new Error(`El artista ${memberId} no es miembro de este grupo`);
    }

    // Validar que no queden con menos de 2 miembros si el grupo está activo
    // if (this.status === GroupStatus.ACTIVO && this._members.length <= 2) {
    //   throw new Error("El grupo debe tener al menos 2 miembros activos, marque el grupo como disuelto");
    // }

    // Remover de la lista de miembros activos
    this._members.splice(memberIndex, 1);

    this.num_members -= 1

  }

  public set_created(){
    this.is_created = true;
  }
  
  public setVisualConcept(visualConcept: string){
    this.visualConcept = visualConcept;
  }
  // Getters
  public getMembersIds(): string[] {
    return [...this._members];
  }

  public isMemberActive(artistId: string): boolean {
    return this._members.some(m => m === artistId);
  }

  public getProposedByArtistId(): string | null {
    return this.proposedByArtistId;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDebutDate(): Date {
    return this.debut_date;
  }

  public getStatus(): GroupStatus {
    return this.status;
  }

  public isCreated(): boolean {
    return this.is_created;
  }

  public getConcept(): string {
    return this.concept;
  }

  public getVisualConcept(): string | null {
    return this.visualConcept;
  }

  public getAgency(): string {
    return this.agencyId;
  }

    public getNumberOfMembers(): number {
    return this.num_members;
  }

}

interface MembershipInfo {
  groupId: string;
  artistId: string;
  start_date: Date;
  role: ArtistRole;
  artistDebutDate: Date;
  endDate?: Date
}



