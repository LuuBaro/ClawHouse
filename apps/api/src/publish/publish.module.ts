import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PublishService } from './publish.service';
import { PublishController } from './publish.controller';
import { FacebookAdapter } from './adapters/facebook.adapter';
import { TikTokAdapter } from './adapters/tiktok.adapter';
import { PrismaService } from '../prisma.service';
import { ChannelService } from '../channels/channel.service';
import { VaultService } from '../vault.service';

@Module({
  imports: [HttpModule],
  controllers: [PublishController],
  providers: [
    PublishService, 
    FacebookAdapter, 
    TikTokAdapter, 
    PrismaService, 
    ChannelService, 
    VaultService
  ],
  exports: [PublishService],
})
export class PublishModule {}
