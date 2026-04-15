import { useState } from 'react'
import type { House } from '../housingTypes'

interface HouseModalProps {
  house?: House
  onSubmit: (data: {
    community: string
    area: string
    info: string
    address: string
    year: number
  }) => void
  onClose: () => void
}

export function HouseModal({ house, onSubmit, onClose }: HouseModalProps) {
  const currentYear = new Date().getFullYear()
  const [community, setCommunity] = useState(house?.community ?? '')
  const [area, setArea] = useState(house?.area ?? '')
  const [info, setInfo] = useState(house?.info ?? '')
  const [address, setAddress] = useState(house?.address ?? '')
  const [year, setYear] = useState(house?.year ?? currentYear)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!community.trim() || !area.trim()) return
    onSubmit({
      community: community.trim(),
      area: area.trim(),
      info: info.trim(),
      address: address.trim(),
      year,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{house ? '编辑房源' : '添加房源'}</h2>
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
            所属小区 *
            <input
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              placeholder="如：万科城市花园"
              required
            />
          </label>
          <label>
            面积 *
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="如：89㎡"
              required
            />
          </label>
          <label>
            备注
            <textarea
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              rows={2}
              placeholder="如：3室2厅1卫"
            />
          </label>
          <label>
            地址
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="如：上海市浦东新区张江镇"
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {house ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
