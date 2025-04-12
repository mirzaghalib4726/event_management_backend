import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Ticket } from 'src/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';

@Table
export class Event extends Model<Event> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  event_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0, // Initial tickets sold
  })
  tickets_sold: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0, // Initial revenue
  })
  revenue: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total_tickets: number; // Total tickets available for the event

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number; // Event organizer

  @BelongsTo(() => User)
  organizer: User;

  @HasMany(() => Ticket) // One-to-many relationship with Ticket (for tickets sold)
  tickets: Ticket[];
}
