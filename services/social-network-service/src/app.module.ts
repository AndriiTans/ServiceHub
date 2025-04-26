import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
