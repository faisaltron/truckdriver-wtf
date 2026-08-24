import { useEffect, useState } from 'react'

export function useDriverCounter(base = 34) {
  const [count, setCount] = useState(base)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2
        const next = prev + delta
        return Math.min(87, Math.max(12, next))
      })
      setPulse(true)
      setTimeout(() => setPulse(false), 300)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return { count, pulse }
}
