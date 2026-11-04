import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitation } from '../config/invitation'

export function FloatingHearts({ celebration = false }: { celebration?: boolean }) {
  const reduced = useReducedMotion()
  return <div className={`floating-hearts ${celebration ? 'celebration' : ''}`} aria-hidden="true">
    {Array.from({ length: celebration ? invitation.animation.confettiCount : invitation.animation.heartCount }, (_, i) => (
      <motion.span key={`${celebration}-${i}`} className={celebration && i % 3 ? 'confetti-piece' : 'floating-heart'}
        style={{ left: `${8 + ((i * 17) % 86)}%`, top: celebration ? '48%' : `${13 + ((i * 29) % 73)}%`, color: i % 2 ? '#A64B5C' : '#d69aa7' }}
        initial={celebration ? { opacity: 0, y: 0, scale: 0.5 } : false}
        animate={reduced ? { opacity: celebration ? 0 : 0.14 } : celebration
          ? { opacity: [0, 1, 1, 0], x: ((i * 59) % 320) - 160, y: [0, -100 - (i % 5) * 38, 250], rotate: i * 40, scale: [0.5, 1, 0.7] }
          : { y: [0, -12, 0], rotate: [-8, 8, -8], opacity: [0.12, 0.25, 0.12] }}
        transition={celebration ? { duration: 1.9, delay: (i % 5) * 0.035 } : { duration: 5 + i % 3, repeat: Infinity, delay: i * 0.6 }}>
        {(!celebration || i % 3 === 0) && <Heart size={i % 2 ? 13 : 19} strokeWidth={1} fill={celebration ? 'currentColor' : 'none'} />}
      </motion.span>
    ))}
  </div>
}
