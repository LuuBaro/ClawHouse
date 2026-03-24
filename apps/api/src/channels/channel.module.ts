import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '../prisma.service';
import { VaultService } from '../vault.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService, VaultService],
  exports: [ChannelService],
})
export class ChannelModule {}
