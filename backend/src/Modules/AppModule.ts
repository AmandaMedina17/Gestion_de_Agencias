import { Module } from '@nestjs/common';
import { DatabaseModule } from './DataBaseModule';
import { AuthModule } from './AuthModule';
import { ResponsibleModule } from './ResponsibleModule';

@Module({
  imports: [
    DatabaseModule,
    ResponsibleModule,
  ],
})
export class AppModule {}