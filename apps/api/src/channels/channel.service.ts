import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VaultService } from '../vault.service';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
    private vault: VaultService,
  ) {}

  async createChannel(workspaceId: string, data: any) {
    const encryptedToken = this.vault.encrypt(data.accessToken);
    return this.prisma.channel.create({
      data: {
        workspaceId,
        provider: data.provider,
        name: data.name,
        externalId: data.externalId,
        status: 'active',
        tokens: {
          create: {
            encryptedAccessToken: encryptedToken,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          },
        },
      },
      include: { tokens: true },
    });
  }

  async getChannel(id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: { tokens: true },
    });
    if (!channel) throw new NotFoundException('Channel not found');
    
    // Decrypt on retrieval if needed for publishing
    const decryptedToken = this.vault.decrypt(channel.tokens!.encryptedAccessToken);
    return { ...channel, accessToken: decryptedToken };
  }

  async listChannels(workspaceId: string) {
    return this.prisma.channel.findMany({
      where: { workspaceId },
      include: { tokens: false }, // Don't expose tokens in list
    });
  }
}
