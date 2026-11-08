import { describe, it, expect } from 'vitest';
import { encryptText, decryptText } from '../../src/lib/security/encryption';

describe('AES-256-GCM Encryption', () => {
  it('encrypts and decrypts sensitive values accurately', async () => {
    const secretKey = 'my_super_secret_32_byte_key_test!';
    const plaintext = 'session_cookie_token_1234567890';

    const encrypted = await encryptText(plaintext, secretKey);
    expect(encrypted).not.toBe(plaintext);
    expect(typeof encrypted).toBe('string');

    const decrypted = await decryptText(encrypted, secretKey);
    expect(decrypted).toBe(plaintext);
  });
});
