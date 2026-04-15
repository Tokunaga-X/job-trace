import { useState, useEffect, useCallback } from 'react'
import type { Job } from '../types'

const STORAGE_KEY = 'job-trace-data'

function generateId(): string {
  return crypto.randomUUID()
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setJobs(JSON.parse(stored))
      } catch {
        loadFromJson()
      }
    } else {
      loadFromJson()
    }
    setLoading(false)
  }, [])

  function loadFromJson() {
    fetch('/data.json')
      .then((r) => r.json())
      .then((data) => {
        const jobs = data.jobs ?? []
        setJobs(jobs)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
      })
      .catch(() => {
        setJobs([])
      })
  }

  function persist(updated: Job[]) {
    setJobs(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const addJob = useCallback((job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().slice(0, 10)
    const newJob: Job = { ...job, id: generateId(), createdAt: now, updatedAt: now }
    persist([...jobs, newJob])
  }, [jobs])

  const updateJob = useCallback((id: string, partial: Partial<Omit<Job, 'id' | 'createdAt'>>) => {
    persist(
      jobs.map((j) =>
        j.id === id ? { ...j, ...partial, updatedAt: new Date().toISOString().slice(0, 10) } : j
      )
    )
  }, [jobs])

  const deleteJob = useCallback((id: string) => {
    persist(jobs.filter((j) => j.id !== id))
  }, [jobs])

  const exportJobs = useCallback(() => {
    const blob = new Blob([JSON.stringify({ jobs }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'job-trace-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [jobs])

  return { jobs, loading, addJob, updateJob, deleteJob, exportJobs }
}