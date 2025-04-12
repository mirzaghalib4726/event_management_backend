import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsService } from 'src/events/events.service';
import { EventsController } from './events.controller';
@Module({
  imports: [ConfigModule],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
