import { useState } from 'react'
import type { Job, JobStatus } from '../types'
import { STATUS_OPTIONS } from '../types'

interface JobModalProps {
  job?: Job
  onSubmit: (data: {
    title: string
    company: string
    status: JobStatus
    info: string
    year: number
  }) => void
  onClose: () => void
}

export function JobModal({ job, onSubmit, onClose }: JobModalProps) {
  const currentYear = new Date().getFullYear()
  const [title, setTitle] = useState(job?.title ?? '')
  const [company, setCompany] = useState(job?.company ?? '')
  const [status, setStatus] = useState<JobStatus>(job?.status ?? '投递中')
  const [info, setInfo] = useState(job?.info ?? '')
  const [year, setYear] = useState(job?.year ?? currentYear)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !company.trim()) return
    onSubmit({ title: title.trim(), company: company.trim(), status, info: info.trim(), year })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{job ? '编辑职位' : '添加职位'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            年份
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={2000}
              max={2100}
            />
          </label>
          <label>
            职位名称 *
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            公司名称 *
            <input value={company} onChange={(e) => setCompany(e.target.value)} required />
          </label>
          <label>
            状态
            <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            补充信息
            <textarea value={info} onChange={(e) => setInfo(e.target.value)} rows={3} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {job ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
