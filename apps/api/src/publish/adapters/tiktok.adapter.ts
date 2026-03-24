import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TikTokAdapter {
  private readonly logger = new Logger(TikTokAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async publishVideo(accessToken: string, videoUrl: string, caption: string, hashtags: string[]) {
    try {
      // TT Content Posting API (v2) - Initial check
      const url = `https://open-api.tiktok.com/v2/post/publish/video/init/`;
      const response = await firstValueFrom(
        this.httpService.post(url, {
          post_info: {
            title: caption,
            privacy_level: 'PUBLIC_TO_EVERYONE',
            video_cover_timestamp_ms: 0,
          },
          source_info: {
             source: 'PULL_FROM_URL',
             video_url: videoUrl,
          }
        }, {
           headers: {
             Authorization: `Bearer ${accessToken}`,
             'Content-Type': 'application/json'
           }
        })
      );
      
      return response.data.data.publish_id;
    } catch (error) {
       this.logger.error(`TT Video Publish Failed: ${error.message}`);
       throw error;
    }
  }
}
