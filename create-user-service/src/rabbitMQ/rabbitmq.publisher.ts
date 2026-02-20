/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { RabbitMQConnection } from './rabbitmq.connection';

@Injectable()
export class RabbitMQPublisher {
  constructor(private readonly rabbit: RabbitMQConnection) {}

  async publish(event: any) {
    const channel = await this.rabbit.getChannel(process.env.RABBITMQ_URL!);

    await channel.assertExchange('sagitarius-a', 'fanout', {
      durable: true,
    });
    channel.publish('sagitarius-a', '', Buffer.from(JSON.stringify(event)), {
      persistent: true,
    });

    console.log('Event published:', event.eventId);
  }
}
