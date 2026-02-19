import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('inbox_messages')
export class InboxMessage {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  eventType: string;

  @Column('jsonb')
  payload: any;

  @CreateDateColumn()
  receivedAt: Date;
}
