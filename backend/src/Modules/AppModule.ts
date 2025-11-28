import { Module } from '@nestjs/common';
import { DatabaseModule } from './DataBaseModule';
import { ResponsibleModule } from './ResponsibleModule';
import { AppController } from '@presentation/Controllers/app.controller';
import { AppService } from '@application/services/app.service';
import { AuthModule } from './auth.module';
import { PlaceModule } from './PlaceModule';
import { ActivityModule } from './ActivityModule';
import { ApprenticeModule } from './ApprenticeModule';
import { ArtistModule } from "./ArtistModule";

@Module({
  imports: [
    DatabaseModule,
    ResponsibleModule,
    AuthModule,
    PlaceModule,
    ActivityModule,
    ApprenticeModule,
    ArtistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
