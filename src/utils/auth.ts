/**
 * Shared secret authentication.
 * Plain text comparison — the secret itself is the key.
 * Never commit the plain text secret to a public repository.
 */
export const SHARED_SECRET = 'leila'

export function verifySecret(secret: string): boolean {
  return secret.trim() === SHARED_SECRET
}

export const AUTH_KEY = 'job-trace-auth'
