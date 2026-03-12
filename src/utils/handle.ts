import { isValidDomain } from '@bako-id/sdk';

export class HandleUtils {
  static isValidHandle(value: string): boolean {
    return value.startsWith('@') && isValidDomain(value);
  }

  static fromHandle(handle: string): string {
    return handle.replace(/^@/, '');
  }

  static toHandle(value: string): string {
    return value.startsWith('@') ? value : `@${value}`;
  }
}
