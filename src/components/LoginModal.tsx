import { useState } from 'react'
import { verifySecret } from '../utils/auth'

interface LoginModalProps {
  onSuccess: () => void
}

export function LoginModal({ onSuccess }: LoginModalProps) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!secret.trim()) return
    if (verifySecret(secret)) {
      sessionStorage.setItem('job-trace-auth', '1')
      onSuccess()
    } else {
      setError('密钥错误')
    }
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
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            解锁
          </button>
        </form>
      </div>
    </div>
  )
}
