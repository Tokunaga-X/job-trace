import type { House } from '../housingTypes'

interface HouseCardProps {
  house: House
  onEdit: (house: House) => void
  onDelete: (id: string) => void
}

export function HouseCard({ house, onEdit, onDelete }: HouseCardProps) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{house.community}</h3>
        <span className="job-status" style={{ backgroundColor: '#8b5cf6' }}>
          {house.area}
        </span>
      </div>
      {house.info && <p className="job-company">{house.info}</p>}
      {house.address && (
        <a
          className="house-address"
          href={`https://rest.amap.com/address/addressComponent?s=jscode&query=${encodeURIComponent(house.address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📍 {house.address}
        </a>
      )}
      <div className="job-footer">
        <span className="job-date">{house.year} 年</span>
        <div className="job-actions">
          <button className="btn-icon" onClick={() => onEdit(house)} title="编辑">
            ✏️
          </button>
          <button className="btn-icon" onClick={() => onDelete(house.id)} title="删除">
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
