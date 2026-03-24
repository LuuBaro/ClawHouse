import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AIService } from '../ai/ai.service';
import { ContentJob, JobStatus } from '@prisma/client';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AIService,
  ) {}

  async createJob(data: {
    title: string;
    sourceUrl?: string;
    platform: string;
    workspaceId: string;
    creatorId: string;
  }): Promise<ContentJob> {
    const job = await this.prisma.contentJob.create({
      data: {
        title: data.title,
        sourceUrl: data.sourceUrl,
        platform: data.platform,
        status: JobStatus.GENERATING,
        workspace: { connect: { id: data.workspaceId } },
        creator: { connect: { id: data.creatorId } },
      },
    });

    // Start AI Process in Background
    this.processAIContent(job.id, data.sourceUrl).catch((err) => {
      this.logger.error(`Error processing job ${job.id}: ${err.message}`);
    });

    return job;
  }

  async findAll(workspaceId: string) {
    return this.prisma.contentJob.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { name: true, email: true } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.contentJob.findUnique({
      where: { id },
      include: {
        creator: true,
        publishJobs: true,
      },
    });
  }

  private async processAIContent(jobId: string, sourceUrl?: string) {
    try {
      const result = await this.ai.generateContentFromSource(
        sourceUrl || 'System Context: Content Creation',
        'OpenClaw Official Brain',
      );

      await this.prisma.contentJob.update({
        where: { id: jobId },
        data: {
          aiOutput: JSON.stringify(result),
          status: JobStatus.PENDING_REVIEW,
          // Extract specific metadata if needed
        },
      });
    } catch (error) {
       await this.prisma.contentJob.update({
         where: { id: jobId },
         data: { status: JobStatus.FAILED },
       });
       throw error;
    }
  }
}
