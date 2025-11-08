import { DateValue} from "../Value Objects/Values";
import { v4 as uuidv4 } from 'uuid';

export class Prize {
    constructor(
        private readonly id: string,
        private name: string,
        private date: DateValue
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.id) {
            throw new Error('El ID del premio es requerido');
        }
        if (!this.name || this.name.length == 0) {
            throw new Error('El nombre del premio es requerido');
        }
        if (!this.date) {
            throw new Error('La fecha del premio es requerida');
        }
        
        // Validar que la fecha del premio no sea en el futuro
        if (this.date.isFuture()) {
            throw new Error('La fecha del premio no puede ser en el futuro');
        }
        if (this.name.length < 2) {
            throw new Error('El nombre del premio debe tener al menos 2 caracteres');
        }
        if (this.name.length > 200) {
            throw new Error('El nombre del premio no puede exceder 200 caracteres');
        }
    }

    public create(name: string, date: DateValue): Prize {
        const id = uuidv4();
        return new Prize(id, name,date);
    }
    // Getters
    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDate(): DateValue {
        return this.date;
    }

    // Métodos de negocio específicos para premios K-pop
    public isRecentPrize(): boolean {
        // Un premio es considerado "reciente" si fue en los últimos 2 años
        const twoYearsAgo = DateValue.today().getYear() - 2;
        return this.date.getYear() >= twoYearsAgo;
    }

    public getYearsSincePrize(): number {
        return DateValue.today().getYear() - this.date.getYear();
    }
}