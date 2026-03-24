import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channels/channel.module';
import { PublishModule } from './publish/publish.module';
import { ContentModule } from './content/content.module';
import { ExportModule } from './export/export.module';
import { LicenseModule } from './license/license.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, 
    ChannelModule,
    PublishModule,
    ContentModule,
    ExportModule,
    LicenseModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
