import { Module } from '@nestjs/common';
import { DatabaseModule } from './DataBaseModule';
import { AuthModule } from './AuthModule';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}