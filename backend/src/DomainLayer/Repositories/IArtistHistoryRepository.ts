export abstract class IArtistHistoryRepository {
    abstract getQualifiedArtistsIds(): Promise<string[]>;
}