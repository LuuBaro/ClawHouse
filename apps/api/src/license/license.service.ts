import { Injectable, OnModuleInit, Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LicenseService implements OnModuleInit {
  private readonly logger = new Logger(LicenseService.name);
  private isActivated = false;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('Verifying System License...');
    await this.verifyLicense();
  }

  async verifyLicense(): Promise<boolean> {
    const license = await this.prisma.license.findFirst();
    if (!license) {
      this.logger.warn('No license found. System is in LIMITED mode.');
      return false;
    }

    try {
      const publicKey = process.env.KINGPREMIUM_LICENSE_PK || 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';
      const decoded = jwt.verify(license.key, publicKey, { algorithms: ['RS256'] }) as any;
      
      if (decoded.expiry && new Date(decoded.expiry) < new Date()) {
         this.logger.error('License EXPIRED.');
         return false;
      }

      this.isActivated = true;
      this.logger.log(`System Activated for: ${decoded.ownerName}`);
      return true;
    } catch (error) {
       this.logger.error(`License Verification Failed: ${error.message}`);
       return false;
    }
  }

  checkFeature(featureName: string): void {
     if (!this.isActivated) {
       throw new UnauthorizedException('Feature requires an active license.');
     }
  }
}
