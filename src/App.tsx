import { useState, useMemo, useEffect } from 'react'
import { useJobs } from './hooks/useJobs'
import { useHouses } from './hooks/useHouses'
import { JobCard } from './components/JobCard'
import { JobModal } from './components/JobModal'
import { HouseCard } from './components/HouseCard'
import { HouseModal } from './components/HouseModal'
import { LoginModal } from './components/LoginModal'
import type { Job, JobStatus } from './types'
import type { House } from './housingTypes'
import { AUTH_KEY } from './utils/auth'
import './App.css'

type Tab = 'jobs' | 'housing'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs')
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      // Skip login in local dev
      setIsUnlocked(true)
    } else {
      setIsUnlocked(sessionStorage.getItem(AUTH_KEY) === '1')
    }
  }, [])

  // Jobs state
  const { jobs, loading: jobsLoading, addJob, updateJob, deleteJob, exportJobs } = useJobs()
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined)
  const [showJobModal, setShowJobModal] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(2022)

  // Housing state
  const { houses, loading: housesLoading, addHouse, updateHouse, deleteHouse, exportHouses } =
    useHouses()
  const [editingHouse, setEditingHouse] = useState<House | undefined>(undefined)
  const [showHouseModal, setShowHouseModal] = useState(false)

  const availableYears = useMemo<number[]>(() => [2022, 2026], [])

  const STATUS_ORDER: Record<JobStatus, number> = {
    Offer: 0,
    已拒绝: 1,
    已放弃: 2,
    投递中: 3,
    面试中: 4,
  }

  const filteredJobs = useMemo(
    () =>
      jobs
        .filter((j) => j.year === selectedYear)
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]),
    [jobs, selectedYear]
  )

  if (isUnlocked === null || jobsLoading || housesLoading) return null

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <div className="tab-bar">
            <button
              className={`tab-btn${activeTab === 'jobs' ? ' tab-btn-active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Job Trace
            </button>
            <button
              className={`tab-btn${activeTab === 'housing' ? ' tab-btn-active' : ''}`}
              onClick={() => setActiveTab('housing')}
            >
              Housing Trace
            </button>
          </div>
        </div>
        <div className="header-actions">
          {isUnlocked && activeTab === 'jobs' && (
            <select
              className="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
          {isUnlocked && activeTab === 'housing' && (
            <button className="btn-secondary" onClick={exportHouses}>导出</button>
          )}
          {isUnlocked && activeTab === 'jobs' && (
            <>
              <button className="btn-secondary" onClick={exportJobs}>导出</button>
              <button className="btn-primary" onClick={() => setShowJobModal(true)}>+ 添加</button>
            </>
          )}
          {isUnlocked && activeTab === 'housing' && (
            <button className="btn-primary" onClick={() => setShowHouseModal(true)}>+ 添加</button>
          )}
        </div>
      </header>

      {/* Job Trace */}
      {activeTab === 'jobs' && isUnlocked && (
        filteredJobs.length === 0 ? (
          <p className="empty">暂无 {selectedYear} 年职位记录</p>
        ) : (
          <div className="job-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={(j) => { setEditingJob(j); setShowJobModal(true) }}
                onDelete={deleteJob}
              />
            ))}
          </div>
        )
      )}

      {/* Housing Trace */}
      {activeTab === 'housing' && isUnlocked && (
        houses.length === 0 ? (
          <p className="empty">暂无房源记录</p>
        ) : (
          <div className="job-grid">
            {houses.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
                  onEdit={(h) => { setEditingHouse(h); setShowHouseModal(true) }}
                onDelete={deleteHouse}
              />
            ))}
          </div>
        )
      )}

      {/* Login modal */}
      {!isUnlocked && (
        <LoginModal onSuccess={() => setIsUnlocked(true)} />
      )}

      {/* Job Modal */}
      {showJobModal && (
        <JobModal
          job={editingJob}
          onSubmit={(data) => {
            if (editingJob) updateJob(editingJob.id, data)
            else addJob(data)
          }}
          onClose={() => { setShowJobModal(false); setEditingJob(undefined) }}
        />
      )}

      {/* House Modal */}
      {showHouseModal && (
        <HouseModal
          house={editingHouse}
          onSubmit={(data) => {
            if (editingHouse) updateHouse(editingHouse.id, data)
            else addHouse(data)
          }}
          onClose={() => { setShowHouseModal(false); setEditingHouse(undefined) }}
        />
      )}
    </div>
  )
}

export default App
