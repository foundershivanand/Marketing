/**
 * AES-256-GCM Encryption Utility
 * Securely encrypts sensitive values (credentials, browser session state).
 * Uses standard Web Crypto API compatible with Cloudflare Workers and Node.js.
 */

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const rawKey = enc.encode(secret.padEnd(32, '0').slice(0, 32));
  return await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(plaintext: string, secretKey?: string): Promise<string> {
  const secret = secretKey || process.env.ENCRYPTION_KEY || 'default_launchpilot_fallback_key_32';
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
  const secret = secretKey || process.env.ENCRYPTION_KEY || 'default_launchpilot_fallback_key_32';
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
