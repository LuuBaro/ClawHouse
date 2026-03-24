import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('jobs')
  async createJob(@Body() body: { title: string; sourceUrl?: string; platform: string; workspaceId: string }, @Request() req) {
    return this.contentService.createJob({
      ...body,
      creatorId: req.user.id,
    });
  }

  @Get('jobs')
  async findAll(@Request() req) {
    // For demo, use the first workspace or get from query
    const workspaceId = req.user.workspaces?.[0]?.id || 'default_ws';
    return this.contentService.findAll(workspaceId);
  }

  @Get('jobs/:id')
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Get('stats')
  async getStats(@Request() req) {
    const workspaceId = req.user.workspaces?.[0]?.id || 'default_ws';
    const jobs = await this.contentService.findAll(workspaceId);
    
    return {
      total: jobs.length,
      generating: jobs.filter(j => j.status === 'GENERATING').length,
      published: jobs.filter(j => j.status === 'PUBLISHED').length,
      failed: jobs.filter(j => j.status === 'FAILED').length,
    };
  }
}
