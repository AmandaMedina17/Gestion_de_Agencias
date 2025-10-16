import { AlbumID} from "../Value Objects/IDs";
import {DateValue} from "../Value Objects/Values";
         
    //FALTAN LAS CANCIONES Y LO RELACIONADO CON ELLAS
    
export class AlbumEntity {
    private songs = []
    constructor(
        private readonly id: AlbumID,
        private title: string,
        private releaseDate: DateValue,
        private mainProducer: string,
        private copiesSold: number,
        private numberOfTracks: number,
    ) {
        this.validate();
    }

    private validate(): void {
        if (this.copiesSold < 0) {
            throw new Error('El número de copias vendidas no puede ser negativo');
        }

        if (this.numberOfTracks <= 0) {
            throw new Error('El álbum debe tener al menos una canción');
        }

        if (this.numberOfTracks > 50) {
            throw new Error('El álbum no puede tener más de 50 canciones');
        }

        if (this.releaseDate.isFuture()) {
            throw new Error('La fecha de lanzamiento no puede estar en el futuro');
        }
        if (!this.mainProducer || this.mainProducer.length === 0) {
            throw new Error('El nombre del productor no puede estar vacío');
        }
        if (this.mainProducer.length < 2) {
            throw new Error('El nombre del productor debe tener al menos 2 caracteres');
        }
        if (this.mainProducer.length > 100) {
            throw new Error('El nombre del productor no puede exceder 100 caracteres');
        }
    }

    // ✅ MÉTODOS DE NEGOCIO PARA K-POP

    /**
     * Verifica si el álbum es exitoso basado en ventas
     * Estándares K-pop: 
     * - >100,000: Éxito
     * - >500,000: Gran éxito  
     * - >1,000,000: Superéxito
     */
    public getSuccessLevel(): string {
        if (this.copiesSold >= 1000000) {
            return "SUPER_SUCCESS";
        } else if (this.copiesSold >= 500000) {
            return "GREAT_SUCCESS";
        } else if (this.copiesSold >= 100000) {
            return "SUCCESS";
        } else if (this.copiesSold >= 50000) {
            return "MODERATE";
        } else {
            return "NEW";
        }
    }

    /**
     * Calcula la antigüedad del álbum en años
     */
    public getAlbumAge(): number {
        return this.releaseDate.getAge();
    }

    /**
     * Verifica si es un álbum reciente (menos de 1 año)
     */
    public isRecentAlbum(): boolean {
        return this.getAlbumAge() < 1;
    }

    public getId(): AlbumID {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getReleaseDate(): DateValue {
        return this.releaseDate;
    }

    public getMainProducer(): string {
        return this.mainProducer;
    }

    public getCopiesSold(): number {
        return this.copiesSold;
    }

    public getNumberOfTracks(): number {
        return this.numberOfTracks;
    }

    public setMainProducer(producer: string): void {
        this.mainProducer = producer;
    }

    public setCopiesSold(copies: number): void {
        if (copies < 0) {
            throw new Error('El número de copias vendidas no puede ser negativo');
        }
        this.copiesSold = copies;
    }

    public setNumberOfTracks(tracks: number): void {
        if (tracks <= 0) {
            throw new Error('El álbum debe tener al menos una canción');
        }
        if (tracks > 50) {
            throw new Error('El álbum no puede tener más de 50 canciones');
        }
        this.numberOfTracks = tracks;
    }
}