import React, { useEffect, useState } from 'react'

export default function WispCursor(){
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true) }
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave) }
  }, [])

  if (!visible) return null
  return (
    <div className="fixed w-8 h-8 rounded-full pointer-events-none z-100 blur-md transition-transform duration-100 ease-out mix-blend-difference" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)' }} />
  )
}
