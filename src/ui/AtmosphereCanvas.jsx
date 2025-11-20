import React, { useRef, useEffect } from 'react'

export default function AtmosphereCanvas({ theme }){
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    class Particle {
      constructor(){ this.reset() }
      reset(){
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.life = Math.random() * 100
        this.opacity = 0
      }
      update(){
        this.x += this.speedX
        this.y += this.speedY
        this.life--
        if (this.life < 20) this.opacity -= 0.02
        else if (this.opacity < 0.6) this.opacity += 0.02
        if (this.life <= 0 || this.opacity <= 0) this.reset()
      }
      draw(ctx, color){
        ctx.fillStyle = color.replace('OPACITY', this.opacity)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => { particles = []; const count = theme === 'fireflies' ? 150 : 300; for (let i=0;i<count;i++) particles.push(new Particle()) }
    init()

    const animate = () => {
      ctx.fillStyle = 'rgba(26, 26, 26, 0.1)'
      ctx.fillRect(0,0,canvas.width,canvas.height)
      particles.forEach(p => {
        p.update()
        if (theme === 'smoke'){
          p.y -= 0.3
          p.size = Math.random() * 40 + 20
          let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          grad.addColorStop(0, `rgba(212, 163, 115, ${p.opacity * 0.1})`)
          grad.addColorStop(1, 'rgba(26, 26, 26, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (theme === 'fireflies'){
          p.size = Math.random() * 2
          ctx.shadowBlur = 10
          ctx.shadowColor = '#83c5be'
          p.draw(ctx, `rgba(131, 197, 190, OPACITY)`)
          ctx.shadowBlur = 0
        } else if (theme === 'water'){
          p.x += 0.5
          p.size = Math.random() * 5 + 2
          ctx.fillStyle = `rgba(141, 153, 174, ${p.opacity * 0.3})`
          ctx.fillRect(p.x, p.y, p.size * 4, p.size)
        }
      })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId) }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-60" />
}
