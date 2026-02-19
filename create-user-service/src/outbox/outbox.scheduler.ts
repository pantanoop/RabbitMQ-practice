import { Injectable, OnModuleInit } from '@nestjs/common';
import { OutboxProcessor } from './outbox.processor';

@Injectable()
export class OutboxScheduler implements OnModuleInit {
  constructor(private readonly processor: OutboxProcessor) {}

  onModuleInit() {
    setInterval(() => {
      void this.processor.processPendingMessages();
    }, 3000);
  }
}
