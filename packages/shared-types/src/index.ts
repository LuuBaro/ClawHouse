import { z } from 'zod';

export const ContentStatusSchema = z.enum([
  'draft',
  'generating',
  'pending_review',
  'approved',
  'rejected',
  'scheduled',
  'published',
  'failed',
]);

export type ContentStatus = z.infer<typeof ContentStatusSchema>;

export const PlatformSchema = z.enum(['facebook', 'tiktok']);
export type Platform = z.infer<typeof PlatformSchema>;

export const AICreativeOutputSchema = z.object({
  angles: z.array(z.string()),
  hook: z.string(),
  script: z.string(),
  captions: z.array(z.string()),
  suggestedHashtags: z.array(z.string()),
  imagePrompts: z.array(z.string()),
  riskNotes: z.string().optional(),
});

export type AICreativeOutput = z.infer<typeof AICreativeOutputSchema>;

export interface ContentJob {
  id: string;
  workspaceId: string;
  sourceId?: string;
  channelId: string;
  status: ContentStatus;
  platforms: Platform[];
  createdAt: string;
  updatedAt: string;
  aiOutput?: AICreativeOutput;
}
