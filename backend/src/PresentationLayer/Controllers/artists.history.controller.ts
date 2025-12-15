
import { ArtistsHistoryService } from "@application/services/artist-history.service";
import { Controller, Get } from "@nestjs/common";

@Controller('artists-history')
export class ArtistHistoryController {
    constructor(
        private readonly artistsHistoryService: ArtistsHistoryService
    ) {}

    @Get()
    getArtistsHistory() {
        return this.artistsHistoryService.getArtistsHistory();
    }
}