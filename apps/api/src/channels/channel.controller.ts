import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.channelService.createChannel(req.user.workspaceId, body);
  }

  @Get()
  async list(@Request() req) {
    return this.channelService.listChannels(req.user.workspaceId);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.channelService.getChannel(id);
  }
}
