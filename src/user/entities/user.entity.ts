import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Ticket } from 'src/entities/ticket.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Optional refresh token
  })
  refresh_token?: string;

  @Column({
    type: DataType.ENUM('organizer', 'attendee'),
    allowNull: false,
    defaultValue: 'attendee', // Default role is "attendee"
  })
  user_type: 'organizer' | 'attendee';

  @HasMany(() => Event) // One-to-many relationship with Event (User as Organizer)
  events: Event[];

  @HasMany(() => Ticket) // One-to-many relationship with Ticket (User as Attendee)
  tickets: Ticket[];
}
