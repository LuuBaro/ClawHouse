import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { AIService } from '../ai/ai.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [ContentController],
  providers: [ContentService, AIService, PrismaService],
  exports: [ContentService],
})
export class ContentModule {}
