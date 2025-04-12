import { IsDateString, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  location: string;

  @IsInt()
  totalTickets: number;

  @IsNumber()
  ticketPrice: number;
}
