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
import { BillboardListModule } from './billboard-list/billboard-list.module';
import { SongModule } from './song/song.module';
import { AlbumModule } from './album/album.module';
import { AwardModule } from './award/award.module';
import { GroupModule } from './GroupModule';
import { ArtistActivityModule } from './ArtistActivityModule';
import { GroupActivityModule } from './GroupActivityModule';
import { SongBillboardModule } from './song_billboard/song_billboard.module';
import { GroupDebutModule } from './GroupDebutModule';
import { ApprenticeEvaluationModule } from './ApprenticeEvaluationModule';

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
    BillboardListModule,
    SongModule,
    AlbumModule,
    AwardModule,
    GroupModule,
    ArtistActivityModule,
    GroupActivityModule,
    SongBillboardModule,
    GroupDebutModule,
    ApprenticeEvaluationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
