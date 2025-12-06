import { GroupStatus } from "../Enums";
import { v4 as uuidv4 } from 'uuid';
import { Artist } from "./Artist";
import { IUpdatable } from "@domain/UpdatableInterface";
import { UpdateData } from "@domain/UpdateData";

export class Group implements IUpdatable{
  
  private _members: Artist[] = []; // Lista interna de miembros

  constructor(
    private readonly id: string,
    private name: string,
    private status: GroupStatus,
    private debut_date: Date,
    private concept: string,
    // private visual_concept 
    private is_created: boolean,
    private agencyId: string,
    // private proposedByArtistId?: string,
    members?: Artist[] 
  ) {
    if (members) {
      this._members = members;
    }
    this.validate();
  }
  update(updateDto: UpdateData): void {
    throw new Error("Method not implemented.");
  }

  private validate(): void {
      if (!this.id) {
        throw new Error("El ID del grupo es requerido");
      }
      if (!this.name || this.name.length < 2) {
        throw new Error("El nombre del grupo debe tener al menos 2 caracteres");
      }
      if (this.name.length > 200) {
        throw new Error("El nombre del grupo no puede exceder 200 caracteres");
      }
      if (!this.concept || this.concept.length == 0) {
        throw new Error("El concepto del grupo es requerido");
      }
      if (!this.agencyId || this.agencyId.length == 0) {
        throw new Error("El grupo debe tener una agencia que lo represente");
      }
  }

  static create( name: string, status: GroupStatus, debut_date: Date, concept: string, is_created: boolean, agencyId: string) : Group {
    const id = uuidv4();
    return new Group(id, name, status, debut_date, concept, is_created, agencyId);
  }

  public getNumberOfMembers(): number {
    return this._members.length;
  }

   // Método para agregar un miembro
  public addMember(member: Artist): void {
    // Validar que el miembro no esté ya en el grupo
    if (this._members.some(m => m.getId() === member.getId())) {
      throw new Error("El miembro ya pertenece a este grupo");
    }
   
    this._members.push(member);
  }

  // Método para remover un miembro
  public removeMember(memberId: string): void {
    const member = this._members.find(m => m.getId() === memberId);
    if (member) {
      // Validar que no queden con menos de 2 miembros
      if (this.getNumberOfMembers() < 2) {
        throw new Error("El grupo debe tener al menos 2 miembros activos, no se puede eliminar otro miembro, marque el grupo como disuelto");
      }

      this._members = this._members.filter(m => m.getId() !== memberId);
    }
  }

  // Getters
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

  public getAgency(): string {
    return this.agencyId;
  }

  // public getArtist(): string | undefined {
  //   return this.proposedByArtistId;
  // }

 
}
