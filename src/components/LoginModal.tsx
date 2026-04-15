import { useState } from 'react'
import { verifySecretAsync } from '../utils/auth'

interface LoginModalProps {
  onSuccess: () => void
}

export function LoginModal({ onSuccess }: LoginModalProps) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!secret.trim()) return
    setLoading(true)
    setError('')
    const ok = await verifySecretAsync(secret.trim())
    if (ok) {
      sessionStorage.setItem('job-trace-auth', '1')
      onSuccess()
    } else {
      setError('密钥错误')
    }
    setLoading(false)
  }

  return (
    <div className="login-overlay">
      <div className="login-box">
        <h2>🔒 解锁编辑权限</h2>
        <p className="login-hint">输入共享密钥以解锁数据编辑功能</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="login-input"
            placeholder="请输入密钥..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '验证中...' : '解锁'}
          </button>
        </form>
      </div>
    </div>
  )
}
