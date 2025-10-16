// export class Money{
//     constructor(private readonly amount: number,
//                 private readonly currency: string){
//         if(amount<0){
//             throw new Error("El monto del ingreso no puede ser negativo");
//         }
//         if(!['KRW', 'USD', 'CUP', 'EUR'].includes(currency)){ // krw moneda de korea
//             throw new Error("Moneda no valida");
//         }
//     }
    
//     public getAmount(): number{
//         return this.amount;
//     }

//     public getCurrency(): string{
//         return this.currency;
//     }

//     public add(other: Money): Money{
//         if(other.currency !== this.currency)
//         {
//             throw new Error("No se pueden sumar diferentes monedas");
//         }
//         return new Money(this.amount + other.amount, this.currency);
//     }

//     public multiply(other: Money): Money{
//         if(other.currency !== this.currency)
//         {
//             throw new Error("No se pueden multiplicar diferentes monedas");
//         }
//         return new Money(this.amount * other.amount, this.currency);
//     }

//     public convert_currency(target_currency: string): Money{ //anadir cambios de moneda de ahora
//         if(!['KRW', 'USD', 'CUP', 'EUR'].includes(target_currency)){
//             throw new Error("Moneda no valida");
//         }
//         return new Money(this.amount, this.currency);

//     }
// }

// export class ApprenticeID{
//     private static nextId: number = 1; // cntadoro para auto-incremento

//     private constructor(private readonly value: number) {
        
//     }

//     public static create(): ApprenticeID{
//         const newId = new ApprenticeID(ApprenticeID.nextId);
//         ApprenticeID.nextId++;
//         return newId;
//     }

//     public getNext(): ApprenticeID {
//         return new ApprenticeID(this.value + 1);
//     }

//     public getValue(): number {
//         return this.value;
//     }

//     public equals(other: ApprenticeID): boolean {
//         return this.value === other.value;
//     }
   
// }

// export class EvaluationID{
//     private static nextId: number = 1; // cntadoro para auto-incremento

//     private constructor(private readonly value: number) {
        
//     }

//     public static create(): EvaluationID{
//         const newId = new EvaluationID(EvaluationID.nextId);
//         EvaluationID.nextId++;
//         return newId;
//     }

//     public getNext(): EvaluationID {
//         return new EvaluationID(this.value + 1);
//     }

//     public getValue(): number {
//         return this.value;
//     }

//     public equals(other: EvaluationID): boolean {
//         return this.value === other.value;
//     }
   
// }

// export class DateValue {
//     private constructor(private readonly value: Date) {
//         if (isNaN(value.getTime())) {
//             throw new Error('Invalid Date');
//         }
//     }


//     // Crea una DateValue a partir de un string en formato (YYYY-MM-DD)
//     public static fromString(dateString: string): DateValue {
//         if (!dateString || dateString.trim().length === 0) {
//             throw new Error('La cadena de fecha no puede estar vacía');
//         }

//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) {
//             throw new Error(`Formato de fecha inválido: ${dateString}. Use YYYY-MM-DD`);
//         }

//         return new DateValue(date);
//     }

//     //Crea una DateValue a partir de componentes numéricos
//     public static fromNumber(year: number, month: number, day: number): DateValue {
//         if (year < 1900 || year > 2100) {
//             throw new Error('El año debe estar entre 1900 y 2100');
//         }

//         if (month < 1 || month > 12) {
//             throw new Error('El mes debe estar entre 1 y 12');
//         }

//         if (day < 1 || day > 31) {
//             throw new Error('El día debe estar entre 1 y 31');
//         }

//         const date = new Date(year, month - 1, day); // month es 0-indexed en JS
//         return new DateValue(date);
//     }

//     //Crea una DateValue con la fecha actual
//     public static today(): DateValue {
//         const now = new Date();
//         const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//         return new DateValue(today);
//     }

//     // ✅ VALIDACIONES ESPECÍFICAS DEL DOMINIO K-POP

//     /**
//      * Verifica si la fecha es válida para una fecha de nacimiento de artista
//      * Regla: Debe ser mayor a 18 años y menor a 70 años
//      */
//     public isValidBirthDate(): boolean {
//         const age = this.getAge();
//         return age >= 18 && age <= 70;
//     }

//     /**
//      * Verifica si la fecha es válida para una fecha de debut
//      * Regla: No puede ser en el futuro y el artista debe tener al menos 14 años
//      */
//     public isValidDebutDate(birthDate: DateValue): boolean {
//         if (this.isFuture()) {
//             return false;
//         }

//         const debutAge = birthDate.getAgeAt(this);
//         return debutAge >= 18;
//     }

//     /**
//      * Verifica si la fecha representa a un artista mayor de edad(18 años)
//      */
//     public isLegalAdult(): boolean {
//         return this.getAge() >= 18;
//     }


//     //Verifica si esta fecha es igual a otra
//     public equals(other: DateValue): boolean {
//         return this.toISOString() === other.toISOString();
//     }

//     //Verifica si esta fecha es anterior a otra
//     public isBefore(other: DateValue): boolean {
//         return this.value < other.value;
//     }

//     //Verifica si esta fecha es posterior a otra
//     public isAfter(other: DateValue): boolean {
//         return this.value > other.value;
//     }

//     // Verifica si esta fecha está entre dos fechas
//     public isBetween(start: DateValue, end: DateValue): boolean {
//         return (this.equals(start) || this.isAfter(start)) && 
//                (this.equals(end) || this.isBefore(end));
//     }



//     //Calcula la edad en una fecha específica
//     public getAgeAt(atDate: DateValue): number {
//         const birth = this.value;
//         const at = atDate.value;

//         let age = at.getFullYear() - birth.getFullYear();
//         const monthDiff = at.getMonth() - birth.getMonth();
        
//         if (monthDiff < 0 || (monthDiff === 0 && at.getDate() < birth.getDate())) {
//             age--;
//         }

//         return age;
//     }

//     //Calcula la diferencia en días con otra fecha
//     public differenceInDays(other: DateValue): number {
//         const diffTime = Math.abs(this.value.getTime() - other.value.getTime());
//         return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     }

//     //Calcula la diferencia en años con otra fech
//     public differenceInYears(other: DateValue): number {
//         return Math.abs(this.getAgeAt(other));
//     }


//     //Verifica si la fecha está en el futuro
//     public isFuture(): boolean {
//         return this.isAfter(DateValue.today());
//     }

//     //Verifica si la fecha está en el pasado
//     public isPast(): boolean {
//         return this.isBefore(DateValue.today());
//     }

//     //Verifica si la fecha es hoy
//     public isToday(): boolean {
//         return this.equals(DateValue.today());
//     }


//     //Retorna la fecha en formato ISO (YYYY-MM-DD)
//     public toISOString(): string {
//         const year = this.value.getFullYear();
//         const month = String(this.value.getMonth() + 1).padStart(2, '0');
//         const day = String(this.value.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     }

//     //Retorna la fecha en formato local (DD/MM/YYYY)
//     public toLocalString(): string {
//         return this.value.toLocaleDateString('es-ES');
//     }

//     //calcula la edad en años
//     public getAge(): number {
//         return this.getAgeAt(DateValue.today());
//     }


//     public getYear(): number {
//         return this.value.getFullYear();
//     }

//     public getMonth(): number {
//         return this.value.getMonth() + 1; // 1-12 en lugar de 0-11
//     }

//     public getDay(): number {
//         return this.value.getDate();
//     }

//     public getDayOfWeek(): string {
//         const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
//         return days[this.value.getDay()];
//     }


//     // ✅ REPRESENTACIÓN

//     public toString(): string {
//         return this.toISOString();
//     }

//     public valueOf(): number {
//         return this.value.getTime();
//     }
// }