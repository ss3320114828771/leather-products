'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  left: string
  top: string
  size: number
  duration: number
  color: string
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    const newStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size + 'px',
            height: star.size + 'px',
            '--duration': star.duration + 's',
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 5}px ${star.color}`
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}