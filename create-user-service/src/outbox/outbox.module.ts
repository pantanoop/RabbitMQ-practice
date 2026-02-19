import { Module } from '@nestjs/common';
import { OutboxProcessor } from './outbox.processor';
import { OutboxScheduler } from './outbox.scheduler';
import { RabbitMQModule } from '../rabbitMQ/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [OutboxProcessor, OutboxScheduler],
})
export class OutboxModule {}
