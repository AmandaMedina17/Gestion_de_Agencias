export class SongID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): SongID{
        const newId = new SongID(SongID.nextId);
        SongID.nextId++;
        return newId;
    }

    public getNext(): SongID {
        return new SongID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: SongID): boolean {
        return this.value === other.value;
    }
   
}

export class BillboardID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): BillboardID{
        const newId = new BillboardID(BillboardID.nextId);
        BillboardID.nextId++;
        return newId;
    }

    public getNext(): BillboardID {
        return new BillboardID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: BillboardID): boolean {
        return this.value === other.value;
    }
}

export class AgencyID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): AgencyID{
        const newId = new AgencyID(AgencyID.nextId);
        AgencyID.nextId++;
        return newId;
    }

    public getNext(): AgencyID {
        return new AgencyID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: AgencyID): boolean {
        return this.value === other.value;
    }
}

export class ApprenticeID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): ApprenticeID{
        const newId = new ApprenticeID(ApprenticeID.nextId);
        ApprenticeID.nextId++;
        return newId;
    }

    public getNext(): ApprenticeID {
        return new ApprenticeID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: ApprenticeID): boolean {
        return this.value === other.value;
    }
   
}

export class EvaluationID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): EvaluationID{
        const newId = new EvaluationID(EvaluationID.nextId);
        EvaluationID.nextId++;
        return newId;
    }

    public getNext(): EvaluationID {
        return new EvaluationID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: EvaluationID): boolean {
        return this.value === other.value;
    }
   
}

export class ResponsibleID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): ResponsibleID{
        const newId = new ResponsibleID(ResponsibleID.nextId);
        ResponsibleID.nextId++;
        return newId;
    }

    public getNext(): ResponsibleID {
        return new ResponsibleID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: ResponsibleID): boolean {
        return this.value === other.value;
    }
   
}

export class IngressID{
    private static nextId: number = 1; // cntadoro para auto-incremento

    private constructor(private readonly value: number) {
        
    }

    public static create(): IngressID{
        const newId = new IngressID(IngressID.nextId);
        IngressID.nextId++;
        return newId;
    }

    public getNext(): IngressID {
        return new IngressID(this.value + 1);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: IngressID): boolean {
        return this.value === other.value;
    }
   
}

export class ActivityID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create(): ActivityID {
        const newId = new ActivityID(ActivityID.nextId);
        ActivityID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: ActivityID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `ACT-${this.value.toString().padStart(3, '0')}`;
    }
}

export class IntervalID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create(): IntervalID {
        const newId = new IntervalID(IntervalID.nextId);
        IntervalID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: IntervalID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `INT-${this.value.toString().padStart(3, '0')}`;
    }
}

export class AlbumID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create(): AlbumID {
        const newId = new AlbumID(AlbumID.nextId);
        AlbumID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: AlbumID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `ALB-${this.value.toString().padStart(3, '0')}`;
    }
}


export class PrizeID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create(): PrizeID {
        const newId = new PrizeID(PrizeID.nextId);
        PrizeID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: PrizeID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `PRIZE-${this.value.toString().padStart(3, '0')}`;
    }
}

export class ContractID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create(): ContractID {
        const newId = new ContractID(ContractID.nextId);
        ContractID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: ContractID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `CONTRACT-${this.value.toString().padStart(3, '0')}`;
    }
}

export class DateID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create():DateID {
        const newId = new DateID(DateID.nextId);
        DateID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: DateID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `Date-${this.value.toString().padStart(3, '0')}`;
    }
}

export class GroupID {
    private static nextId: number = 1;

    private constructor(private readonly value: number) {}

    public static create():GroupID {
        const newId = new GroupID(GroupID.nextId);
        GroupID.nextId++;
        return newId;
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: GroupID): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return `GroupID-${this.value.toString().padStart(3, '0')}`;
    }
}