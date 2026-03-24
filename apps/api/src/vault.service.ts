import { Injectable } from '@nestjs/common';
import * as aes from 'aes-js';

@Injectable()
export class VaultService {
  private readonly encryptionKey: Uint8Array;

  constructor() {
    // 32-byte key from env (padded or trimmed if needed)
    const keyStr = process.env.ENCRYPTION_KEY || 'KINGPREMIUM_SECRET_KEY_2026_OPEN';
    this.encryptionKey = aes.utils.utf8.toBytes(keyStr.substring(0, 32));
  }

  encrypt(text: string): string {
    const textBytes = aes.utils.utf8.toBytes(text);
    const aesCtr = new aes.ModeOfOperation.ctr(this.encryptionKey, new aes.Counter(5));
    const encryptedBytes = aesCtr.encrypt(textBytes);
    return aes.utils.hex.fromBytes(encryptedBytes);
  }

  decrypt(hex: string): string {
    const encryptedBytes = aes.utils.hex.toBytes(hex);
    const aesCtr = new aes.ModeOfOperation.ctr(this.encryptionKey, new aes.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedBytes);
  }
}
