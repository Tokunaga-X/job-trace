/**
 * Shared secret authentication.
 * The secret is stored as a SHA-256 hash in this file.
 * Never commit the plain text secret.
 *
 * How to generate the hash:
 *   node -e "console.log(require('crypto').createHash('sha256').update('YOUR_SECRET').digest('hex'))"
 */
export const SHARED_SECRET_HASH = 'placeholder' // ← replace with your actual hash

export async function verifySecretAsync(secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex === SHARED_SECRET_HASH
}

export const AUTH_KEY = 'job-trace-auth'
