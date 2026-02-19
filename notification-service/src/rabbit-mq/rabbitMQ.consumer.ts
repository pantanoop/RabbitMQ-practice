/* eslint-disable */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RabbitMQConnection } from './rabbitMQ.connection';
import { InboxMessage } from '../inbox/entities/inbox.entity';

@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(
    private readonly rabbit: RabbitMQConnection,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const channel = await this.rabbit.getChannel(process.env.RABBITMQ_URL!);

    await channel.assertExchange('users.fanout', 'fanout', {
      durable: true,
    });

    const queue = await channel.assertQueue('notification_queue', {
      durable: true,
    });

    await channel.bindQueue(queue.queue, 'users.fanout', '');

    channel.consume(
      queue.queue,
      async (msg) => {
        if (!msg) return;

        const content = JSON.parse(msg.content.toString());

        try {
          await this.handleMessage(content);
          channel.ack(msg);
        } catch (err) {
          this.logger.error('Processing failed', err);
          channel.nack(msg, false, true);
        }
      },
      { noAck: false },
    );
  }

  private async handleMessage(event: any) {
    await this.dataSource.transaction(async (manager) => {
      const inboxRepo = manager.getRepository(InboxMessage);

      const exists = await inboxRepo.findOne({
        where: { id: event.eventId },
      });

      if (exists) {
        this.logger.warn(`Duplicate event ignored: ${event.eventId}`);
        return;
      }

      const inbox = inboxRepo.create({
        id: event.eventId,
        eventType: event.type,
        payload: event.payload,
      });

      await inboxRepo.save(inbox);

      console.log('Notification Service received event:', event.payload);
    });
  }
}
