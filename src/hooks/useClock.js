import { useEffect, useState } from 'react'

function formatClock(date) {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  if (hours === 0) hours = 12
  const paddedMinutes = String(minutes).padStart(2, '0')
  return `${hours}.${paddedMinutes} ${period}`
}

export function useClock() {
  const [label, setLabel] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const interval = setInterval(() => {
      setLabel(formatClock(new Date()))
    }, 1000 * 15)
    return () => clearInterval(interval)
  }, [])

  return label
}
