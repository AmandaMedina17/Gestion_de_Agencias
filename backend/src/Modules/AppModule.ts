import { Module } from '@nestjs/common';
import { DatabaseModule } from './DataBaseModule';
import { ResponsibleModule } from './ResponsibleModule';
import { AppController } from '@presentation/Controllers/app.controller';
import { AppService } from '@application/services/app.service';
import { AuthModule } from './auth.module';
import { PlaceModule } from './PlaceModule';
import { ActivityModule } from './ActivityModule';
import { ApprenticeModule } from './ApprenticeModule';
import { IncomeModule } from './IncomeModule';
import { ArtistModule } from "./ArtistModule";
import { AgencyModule } from './AgencyModule';
import { ContractModule } from './ContractModule';
import { SongModule } from './song/song.module';
import { Album } from '@domain/Entities/Album';
import { AlbumModule } from './album/album.module';
import { BillboardListModule } from './billboard-list/billboard-list.module';

@Module({
  imports: [
    DatabaseModule,
    ResponsibleModule,
    AuthModule,
    PlaceModule,
    ActivityModule,
    ApprenticeModule,
    IncomeModule,
    ArtistModule,
    AgencyModule,
    ContractModule,
    SongModule,
    AlbumModule,
    BillboardListModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
