import type { Job } from '../types'

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  投递中: '#3b82f6',
  面试中: '#f59e0b',
  Offer: '#10b981',
  已拒绝: '#ef4444',
  已放弃: '#6b7280',
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const color = STATUS_COLORS[job.status] ?? '#6b7280'

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className="job-status" style={{ backgroundColor: color }}>
          {job.status}
        </span>
      </div>
      <p className="job-company">{job.company}</p>
      {job.info && <p className="job-info">{job.info}</p>}
      <div className="job-footer">
        <span className="job-date">{job.updatedAt.length > 4 ? job.updatedAt : job.updatedAt + ' 年'}</span>
        <div className="job-actions">
          <button className="btn-icon" onClick={() => onEdit(job)} title="编辑">
            ✏️
          </button>
          <button className="btn-icon" onClick={() => onDelete(job.id)} title="删除">
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}