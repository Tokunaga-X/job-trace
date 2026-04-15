export type JobStatus = '投递中' | '面试中' | 'Offer' | '已拒绝' | '已放弃'

export interface Job {
  id: string
  year: number
  title: string
  company: string
  status: JobStatus
  info: string
  createdAt: string
  updatedAt: string
}

export const STATUS_OPTIONS: JobStatus[] = ['投递中', '面试中', 'Offer', '已拒绝', '已放弃']