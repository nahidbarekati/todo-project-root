import { Module } from '@nestjs/common';
import { MessagingService } from './services/ampq-queue.service';


@Module({
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
