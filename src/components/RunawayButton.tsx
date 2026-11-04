import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitation } from '../config/invitation'

interface Props { attempts: number; onDodge: () => void }
export function RunawayButton({ attempts, onDodge }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const lastDodge = useRef(0)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    function reset() { setPosition(null) }
    window.addEventListener('resize', reset)
    window.visualViewport?.addEventListener('resize', reset)
    return () => {
      window.removeEventListener('resize', reset)
      window.visualViewport?.removeEventListener('resize', reset)
    }
  }, [])
  function dodge() {
    if (!ref.current || Date.now() - lastDodge.current < 300) return
    lastDodge.current = Date.now()
    const rect = ref.current.getBoundingClientRect()
    const viewport = window.visualViewport
    const width = viewport?.width ?? window.innerWidth
    const height = viewport?.height ?? window.innerHeight
    const top = viewport?.offsetTop ?? 0
    // Choose a visible edge lane, leaving the primary action and navigation clear.
    const x = Math.max(16, Math.min(width - rect.width - 16, 16 + Math.random() * Math.max(0, width - rect.width - 32)))
    const y = top + (Math.random() > 0.5 ? 100 + Math.random() * 40 : Math.max(150, height - 160 - Math.random() * 35))
    setPosition({ x, y: Math.min(top + height - rect.height - 20, y) })
    onDodge()
  }
  if (attempts >= invitation.animation.maxDodges) return <span className="runaway-slot" aria-hidden="true" />
  return <span className="runaway-slot"><motion.button ref={ref} className="button secondary runaway"
    style={position ? { position: 'fixed', left: position.x, top: position.y, zIndex: 20 } : {}}
    animate={{ scale: Math.max(0.72, 1 - attempts * 0.055) }}
    transition={{ duration: reduced ? 0 : 0.22 }}
    layout={!reduced} onPointerEnter={event => { if (event.pointerType === 'mouse') dodge() }}
    onPointerDown={event => { event.preventDefault(); dodge() }}
    onClick={event => { if (event.detail === 0) dodge() }}>
    {invitation.texts.no}
  </motion.button></span>
}
