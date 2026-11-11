/**
 * AES-256-GCM Encryption Utility
 * Securely encrypts sensitive values (credentials, browser session state).
 * Uses standard Web Crypto API compatible with Cloudflare Workers and Node.js.
 */

function resolveSecret(secretKey?: string): string {
  const secret = secretKey || process.env.ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is strictly required in production mode.');
    }
    // Safe deterministic key strictly for non-production development/testing
    return 'launchpilot_dev_test_encryption_key_deterministic_2026';
  }
  return secret;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  // Derive a cryptographically uniform 256-bit key via SHA-256 digest
  const keyMaterial = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(plaintext: string, secretKey?: string): Promise<string> {
  const secret = resolveSecret(secretKey);
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encoded = enc.encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return Buffer.from(combined).toString('base64');
}

export async function decryptText(encryptedBase64: string, secretKey?: string): Promise<string> {
  const secret = resolveSecret(secretKey);
  const key = await getKey(secret);
  const combined = Buffer.from(encryptedBase64, 'base64');
  const iv = combined.subarray(0, 12);
  const data = combined.subarray(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}
