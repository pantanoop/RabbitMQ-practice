import { Module } from '@nestjs/common';
import { RabbitMQConnection } from './rabbitMQ.connection';
import { RabbitMQConsumer } from './rabbitMQ.consumer';

@Module({
  providers: [RabbitMQConnection, RabbitMQConsumer],
})
export class RabbitMQModule {}
