import { memo, type CSSProperties } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { invitation } from '../config/invitation'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export const FloatingHearts = memo(function FloatingHearts({ celebration = false, paused = false }: { celebration?: boolean; paused?: boolean }) {
  const reduced = usePrefersReducedMotion()
  if (!celebration) return <div className={`floating-hearts ambient-hearts ${paused ? 'is-paused' : ''}`} aria-hidden="true">
    {Array.from({ length: invitation.animation.heartCount }, (_, i) => {
      const sparkle = i % 5 === 4
      const Icon = sparkle ? Sparkles : Heart
      return <span key={i} className={`ambient-particle ${sparkle ? 'floating-sparkle' : 'floating-heart'}`} style={{
        left: `${3 + ((i * 31) % 94)}%`,
        color: i % 3 ? '#c88798' : '#a64b5c',
        '--drift': `${((i % 7) - 3) * 13}px`,
        '--rest-y': `${9 + ((i * 23) % 83)}%`,
        '--duration': `${13 + (i % 7)}s`,
        '--delay': `${-(i * 3.7) % 19}s`,
      } as CSSProperties}>
        <Icon size={sparkle ? 14 : 14 + (i % 4) * 6} strokeWidth={1} fill={!sparkle && i % 3 === 0 ? 'currentColor' : 'none'} />
      </span>
    })}
  </div>
  if (reduced) return null
  return <div className="floating-hearts celebration" aria-hidden="true">
    {Array.from({ length: invitation.animation.confettiCount }, (_, i) => (
      <motion.span key={i} className={i % 3 ? 'confetti-piece' : 'floating-heart'}
        style={{ left: `${8 + ((i * 17) % 86)}%`, top: '48%', color: i % 2 ? '#A64B5C' : '#d69aa7' }}
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], x: ((i * 59) % 320) - 160, y: [0, -100 - (i % 5) * 38, 250], rotate: i * 40, scale: [0.5, 1, 0.7] }}
        transition={{ duration: 1.9, delay: (i % 5) * 0.035 }}>
        {i % 3 === 0 && <Heart size={i % 2 ? 13 : 19} strokeWidth={1} fill="currentColor" />}
      </motion.span>
    ))}
  </div>
})
