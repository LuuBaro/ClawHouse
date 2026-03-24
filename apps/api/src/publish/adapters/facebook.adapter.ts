import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FacebookAdapter {
  private readonly logger = new Logger(FacebookAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async publishFeedPost(pageId: string, accessToken: string, message: string, mediaUrls?: string[]) {
    try {
      // Logic for posting text + images to Feed
      const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
      const response = await firstValueFrom(
        this.httpService.post(url, {
          message,
          access_token: accessToken,
          attached_media: mediaUrls?.map(u => ({ media_fbid: u })) // Simplified
        })
      );
      return response.data.id;
    } catch (error) {
      this.logger.error(`FB Feed Publish Failed: ${error.response?.data?.error?.message || error.message}`);
      throw error;
    }
  }

  async publishReel(pageId: string, accessToken: string, videoUrl: string, caption: string) {
    try {
      // Reels Phase 1: Initialize
      const initUrl = `https://graph.facebook.com/v19.0/${pageId}/video_reels`;
      const initResponse = await firstValueFrom(
        this.httpService.post(initUrl, {
          upload_phase: 'start',
          access_token: accessToken,
        })
      );
      
      const uploadId = initResponse.data.video_id;
      
      // Reels Phase 2: Upload (Usually via cURL or specific binary stream)
      // Logic would be to download from videoUrl and post to FB binary endpoint
      
      return uploadId;
    } catch (error) {
       this.logger.error(`FB Reels Publish Failed: ${error.message}`);
       throw error;
    }
  }
}
