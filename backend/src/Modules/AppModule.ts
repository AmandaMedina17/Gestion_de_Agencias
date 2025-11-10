import { Module } from '@nestjs/common';
import { DatabaseModule } from './DataBaseModule';
import { ResponsibleModule } from './ResponsibleModule';
import { AppController } from '@presentation/Controllers/app.controller';
import { AppService } from '@application/services/app.service';

@Module({
  imports: [
    DatabaseModule,
    ResponsibleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
