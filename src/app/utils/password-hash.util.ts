import * as CryptoJS from 'crypto-js';

/**
 * Password Hashing Utility
 * Uses SHA-256 hashing via crypto-js
 */
export class PasswordHashUtil {
  
  /**
   * Hash password using SHA-256
   * @param password - Plain text password
   * @returns Promise<string> - Hex string of SHA-256 hash
   */
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Synchronous password hash using crypto-js
   */
  static hashPasswordSync(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }
}
