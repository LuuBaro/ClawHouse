import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { PublishService } from './publish.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('publishing')
@UseGuards(JwtAuthGuard)
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post(':jobId/start')
  async startPublish(@Param('jobId') jobId: string) {
    return this.publishService.publishJob(jobId);
  }
}
