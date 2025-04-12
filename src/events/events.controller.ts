import { Controller } from '@nestjs/common';
import { EventsService } from 'src/events/events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // @Post()
  // async create(@Body() dto: CreateEventDto, @Req() req: any): Promise<any> {
  //   const userId = req.user?.sub;
  //   if (!userId) throw new UnauthorizedException('Authentication required');
  //   return this.eventsService.createEvent(dto, userId);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateEventDto,
  //   @Req() req: any,
  // ): Promise<any> {
  //   const userId = req.user?.sub;
  //   if (!userId) throw new UnauthorizedException('Authentication required');
  //   return this.eventsService.updateEvent(Number(id), dto, userId);
  // }

  // @Get('analytics/:id')
  // async analytics(@Param('id') id: string, @Req() req: any): Promise<any> {
  //   const userId = req.user?.sub;
  //   if (!userId) throw new UnauthorizedException('Authentication required');
  //   return this.eventsService.getEventAnalytics(Number(id), userId);
  // }

  // @Get()
  // async getPublic(): Promise<any> {
  //   return this.eventsService.getPublicEvents();
  // }

  // @Post(':id/book')
  // async book(
  //   @Param('id') id: string,
  //   @Req() req: any,
  // ): Promise<{ checkoutUrl: string; sessionId: string }> {
  //   const userId = req.user?.sub;
  //   if (!userId) throw new UnauthorizedException('Authentication required');
  //   return this.eventsService.bookTicket(Number(id), userId);
  // }

  // @Post('webhook/stripe')
  // async handleWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
  //   const signature = req.headers['stripe-signature'] as string;
  //   return this.eventsService.handleStripeWebhook(signature, req.rawBody);
  // }
}
