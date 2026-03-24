import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AICreativeOutput, AICreativeOutputSchema } from '@openclaw/shared-types';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async generateContent(sourceText: string, platform: string, brandVoice: string): Promise<AICreativeOutput> {
    const apiKey = this.config.get<string>('OPENCLAW_API_KEY');
    
    try {
      // Prompting logic (The Content Brain)
      // For now returning high-quality mock data structure
      const mockResult: AICreativeOutput = {
        angles: ['Phân tích thực chiến', 'Bí mật đằng sau thành công'],
        hook: 'Bạn có bao giờ thắc mắc tại sao đối thủ làm content vù vù còn mình vẫn dậm chân?',
        script: `Trong video này, OpenClaw sẽ bóc tách cách tối ưu workflow bằng AI... Nguồn phân tích từ: ${sourceText}`,
        captions: ['Tự động hóa hay là chết? 🔥', 'Content AI không khó như bạn nghĩ.'],
        suggestedHashtags: ['#OpenClaw', '#ContentMarketing', '#AIAutomation'],
        imagePrompts: ['A futuristic AI robot typing on a glowing laptop in a dark creative studio, vibrant purple lighting.'],
        riskNotes: 'Tránh dùng các từ khóa nhạy cảm về bản quyền nhạc phim.',
      };

      return AICreativeOutputSchema.parse(mockResult);
    } catch (error) {
      this.logger.error(`AI Generation Failed: ${error.message}`);
      throw new Error('AI failed to generate content');
    }
  }

  async generateContentFromSource(source: string, brandVoice: string): Promise<AICreativeOutput> {
    return this.generateContent(source, 'Universal Source', brandVoice);
  }
}
