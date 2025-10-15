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