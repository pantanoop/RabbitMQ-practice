import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from './rabbit-mq/rabbitMQ.module';
import { InboxMessage } from './inbox/entities/inbox.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [InboxMessage],
      synchronize: false,
    }),
    RabbitMQModule,
  ],
})
export class AppModule {}
