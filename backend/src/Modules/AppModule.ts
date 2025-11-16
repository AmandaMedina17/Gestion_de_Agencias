import { Module } from "@nestjs/common";
import { DatabaseModule } from "./DataBaseModule";
import { ResponsibleModule } from "./ResponsibleModule";
import { AppController } from "../PresentationLayer/Controllers/app.controller";
import { AppService } from "../ApplicationLayer/services/app.service";
import { AuthModule } from "./auth.module";
import { PlaceModule } from "./PlaceModule";
import { ApprenticeModule } from "./ApprenticeModule";
import { ArtistModule } from "./ArtistModule";

@Module({
  imports: [
    DatabaseModule,
    ResponsibleModule,
    AuthModule,
    PlaceModule,
    ApprenticeModule,
    ArtistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
