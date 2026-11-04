import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { invitation } from '../config/invitation'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface Burst { id: number; x: number; y: number }

// A bounded layer of short-lived particles; it never intercepts a tap or scroll.
export function HeartBursts({ active }: { active: boolean }) {
  const [bursts, setBursts] = useState<Burst[]>([])
  const sequence = useRef(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    setBursts([])
    if (!active || reduced) return
    const timers = new Map<number, number>()
    let lastBurst = -Infinity
    const settings = invitation.animation

    function emit(target: EventTarget | null, x?: number, y?: number) {
      if (!(target instanceof Element)) return
      const surface = target.closest('button, a.button, .choice, .love-letter')
      if (!surface || surface.matches(':disabled, .close-button')) return
      if (performance.now() - lastBurst < settings.burstCooldownMs) return
      lastBurst = performance.now()
      const box = surface.getBoundingClientRect()
      const burst = { id: sequence.current++, x: x ?? box.left + box.width / 2, y: y ?? box.top + box.height / 2 }
      // Keep timers as bounded as the rendered particles during rapid tapping.
      if (timers.size >= settings.maxBursts) {
        const oldest = timers.keys().next().value
        if (oldest !== undefined) { window.clearTimeout(timers.get(oldest)); timers.delete(oldest) }
      }
      setBursts(current => [...current.slice(Math.max(0, current.length - settings.maxBursts + 1)), burst])
      timers.set(burst.id, window.setTimeout(() => {
        setBursts(current => current.filter(item => item.id !== burst.id))
        timers.delete(burst.id)
      }, (settings.burstDuration + 0.15) * 1000))
    }
    function onPointer(event: PointerEvent) {
      if (event.isPrimary && event.button === 0) emit(event.target, event.clientX, event.clientY)
    }
    function onClick(event: MouseEvent) {
      if (event.detail === 0) emit(event.target)
    }
    document.addEventListener('pointerdown', onPointer, { passive: true })
    document.addEventListener('click', onClick, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('click', onClick)
      timers.forEach(timer => window.clearTimeout(timer))
    }
  }, [active, reduced])

  if (!active || reduced || bursts.length === 0) return null
  return createPortal(<div className="heart-bursts" aria-hidden="true">
    {bursts.map(burst => <div key={burst.id} className="heart-burst" style={{ left: burst.x, top: burst.y }}>
      {Array.from({ length: invitation.animation.burstCount }, (_, i) => {
        const angle = (i / invitation.animation.burstCount) * Math.PI * 2
        const distance = 35 + (i % 3) * 16
        const Icon = i % 4 === 3 ? Sparkles : Heart
        return <motion.span key={i} className="burst-particle" style={{ color: i % 2 ? '#a64b5c' : '#d994a7' }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
          animate={{ opacity: [0, 0.9, 0], x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 32, scale: [0.4, 1.1, 0.65], rotate: (i % 2 ? 1 : -1) * 22 }}
          transition={{ duration: invitation.animation.burstDuration, ease: 'easeOut' }}>
          <Icon size={15 + (i % 3) * 3} strokeWidth={1.2} fill={i % 2 === 0 ? 'currentColor' : 'none'} />
        </motion.span>
      })}
    </div>)}
  </div>, document.body)
}
