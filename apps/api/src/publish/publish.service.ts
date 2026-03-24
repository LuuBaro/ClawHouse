import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FacebookAdapter } from './adapters/facebook.adapter';
import { TikTokAdapter } from './adapters/tiktok.adapter';
import { ChannelService } from '../channels/channel.service';

@Injectable()
export class PublishService {
  private readonly logger = new Logger(PublishService.name);

  constructor(
    private prisma: PrismaService,
    private channelService: ChannelService,
    private fb: FacebookAdapter,
    private tt: TikTokAdapter,
  ) {}

  async publishJob(jobId: string) {
    const job = await this.prisma.contentJob.findUnique({
      where: { id: jobId },
      include: { channel: true, versions: true },
    });

    if (!job) throw new Error('Job not found');

    const lastVersion = job.versions[job.versions.length - 1];
    const { accessToken } = await this.channelService.getChannel(job.channelId);

    try {
      this.logger.log(`Publishing Job ${jobId} to ${job.channel.provider}...`);
      
      let externalId = '';
      if (job.channel.provider === 'facebook') {
        externalId = await this.fb.publishFeedPost(job.channel.externalId, accessToken, lastVersion.scriptContent || '');
      } else if (job.channel.provider === 'tiktok') {
        externalId = await this.tt.publishVideo(accessToken, 'https://s3.s3-compatible/media/vid.mp4', lastVersion.scriptContent || '', []);
      }

      await this.prisma.contentJob.update({
        where: { id: jobId },
        data: { status: 'published' },
      });

      await this.prisma.publishTask.create({
        data: {
          jobId,
          status: 'success',
          externalPostId: externalId,
          platform: job.channel.provider,
        },
      });

      return { success: true, externalId };
    } catch (error) {
       await this.prisma.contentJob.update({
         where: { id: jobId },
         data: { status: 'failed' },
       });
       
       await this.prisma.publishTask.create({
         data: {
           jobId,
           status: 'failed',
           platform: job.channel.provider,
           errorMessage: error.message,
         },
       });
       
       throw error;
    }
  }
}
