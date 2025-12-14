import { IUpdatable } from "@domain/UpdatableInterface";
import { DateValue } from "../Value Objects/Values";
import { v4 as uuidv4 } from "uuid";
import { UpdateData } from "@domain/UpdateData";
import { Song } from "./Song";

//Aqui tengo que implementar las colecciones de navegacion para number of trakcs y number ofawards
export class Album implements IUpdatable{
    constructor(
        private readonly id: string,
        private title: string,
        private releaseDate: Date,
        private mainProducer: string,
        private copiesSold: number,
        private numberOfTracks : number,
        private artistId?: string,
        private groupId?: string
    ) {
        this.validate();
    }

    //Esto hay que implementarlo 
    update(updateDto: UpdateData): void {
        
        updateDto.title = updateDto.title != undefined ? updateDto.title : this.title
        updateDto.releaseDate = updateDto.releaseDate != undefined ? updateDto.releaseDate : this.releaseDate
        updateDto.mainProducer = updateDto.mainProducer != undefined ? updateDto.mainProducer : this.mainProducer
        updateDto.copiesSold = updateDto.copiesSold != undefined ? updateDto.copiesSold : this.copiesSold

        const albumUpadte = Album.create(updateDto.title,updateDto.date, 
            updateDto.mainProducer, updateDto.copiesSold, updateDto.numberOfTracks)
        
        this.title = albumUpadte.title 
        this.releaseDate = albumUpadte.releaseDate 
        this.mainProducer = albumUpadte.mainProducer 
        this.copiesSold = albumUpadte.copiesSold 

    }

    private validate(): void {
        if (this.copiesSold < 0) {
            throw new Error('El número de copias vendidas no puede ser negativo');
        }

        if (this.numberOfTracks < 0) {
            throw new Error('El álbum debe tener al menos una canción');
        }

        if (this.numberOfTracks > 50) {
            throw new Error('El álbum no puede tener más de 50 canciones');
        }
        if (!this.title || this.title.trim().length === 0) {
            throw new Error('El título del álbum no puede estar vacío');
        }
        if (this.title.trim().length < 2) {
            throw new Error('El título del álbum debe tener al menos 2 caracteres');
        }
        if (this.title.trim().length > 200) {
            throw new Error('El título del álbum no puede exceder 200 caracteres');
        }

        // if (this.releaseDate.getTime() > new Date().getTime()) {
        //     throw new Error('La fecha de lanzamiento no puede estar en el futuro');
        // }
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
        return new Date().getTime() - this.releaseDate.getTime();
    }

    /**
     * Verifica si es un álbum reciente (menos de 1 año)
     */
    public isRecentAlbum(): boolean {
        return this.getAlbumAge() < 1;
    }

    // GETTERS

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getReleaseDate(): Date{
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

    getArtistId(): string | undefined {
        return this.artistId;
    }

    getGroupId(): string | undefined {
        return this.groupId;
    }

    assignToArtist(artistId: string): void {
        if (this.groupId) {
            throw new Error('Album is already assigned to a group. Cannot assign to an artist.');
        }
        this.artistId = artistId;
    }

    assignToGroup(groupId: string): void {
        if (this.artistId) {
            throw new Error('Album is already assigned to an artist. Cannot assign to a group.');
        }
        this.groupId = groupId;
    }


    //Estor viola el principio de inmutabilidad dejar asi temporalmente, para despues arreglarlo 
    public setMainProducer(producer: string): void {
        this.mainProducer = producer;
    }

    public setCopiesSold(copies: number): void {
        if (copies < 0) {
            throw new Error('El número de copias vendidas no puede ser negativo');
        }
        this.copiesSold = copies;
    }


    public static create(title: string, releaseDate: Date, mainProducer: string, copiesSold =0, numberOfTracks = 0) : Album{
        return new Album(uuidv4(), title, releaseDate, mainProducer, copiesSold, numberOfTracks);
    }
}