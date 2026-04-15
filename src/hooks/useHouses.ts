import { useState, useEffect, useCallback } from 'react'
import type { House } from '../housingTypes'

const STORAGE_KEY = 'housing-trace-data'

function generateId(): string {
  return crypto.randomUUID()
}

export function useHouses() {
  const [houses, setHouses] = useState<House[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHouses(JSON.parse(stored))
      } catch {
        loadFromJson()
      }
    } else {
      loadFromJson()
    }
    setLoading(false)
  }, [])

  function loadFromJson() {
    fetch('/houses.json')
      .then((r) => r.json())
      .then((data) => {
        const houses = data.houses ?? []
        setHouses(houses)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(houses))
      })
      .catch(() => {
        setHouses([])
      })
  }

  function persist(updated: House[]) {
    setHouses(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const addHouse = useCallback(
    (house: Omit<House, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().getFullYear().toString()
      const newHouse: House = { ...house, id: generateId(), createdAt: now, updatedAt: now }
      persist([...houses, newHouse])
    },
    [houses]
  )

  const updateHouse = useCallback(
    (id: string, partial: Partial<Omit<House, 'id' | 'createdAt'>>) => {
      persist(
        houses.map((h) =>
          h.id === id
            ? { ...h, ...partial, updatedAt: new Date().getFullYear().toString() }
            : h
        )
      )
    },
    [houses]
  )

  const deleteHouse = useCallback(
    (id: string) => {
      persist(houses.filter((h) => h.id !== id))
    },
    [houses]
  )

  const exportHouses = useCallback(() => {
    const blob = new Blob([JSON.stringify({ houses }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'housing-trace-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [houses])

  return { houses, loading, addHouse, updateHouse, deleteHouse, exportHouses }
}
