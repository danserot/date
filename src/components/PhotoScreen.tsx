import { useState } from 'react'
import { ArrowRight, Heart } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { invitation } from '../config/invitation'

export function PhotoScreen({ onNext }: { onNext: () => void }) {
  const [missing, setMissing] = useState(false)
  const reduced = useReducedMotion()
  const pointer = useMotionValue(0)
  const rotateY = useSpring(useTransform(pointer, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 })
  return <section className="screen photo-screen">
    <p className="eyebrow">{invitation.texts.photoEyebrow}</p>
    <motion.div className="polaroid" initial={{ opacity: 0, rotate: reduced ? 0 : -7, y: reduced ? 0 : 20 }} animate={{ opacity: 1, rotate: -3, y: 0 }}
      style={{ rotateY: reduced ? 0 : rotateY }} onPointerMove={event => {
        if (event.pointerType !== 'mouse' || reduced) return
        const rect = event.currentTarget.getBoundingClientRect()
        pointer.set((event.clientX - rect.left) / rect.width - 0.5)
      }} onPointerLeave={() => pointer.set(0)}>
      <span className="photo-tape" aria-hidden="true" />
      <div className="photo-window">
        {missing ? <div className="photo-placeholder"><Heart size={44} strokeWidth={0.8} /><span className="handwritten">{invitation.texts.photoLabel}</span><span className="placeholder-note">{invitation.texts.photoPlaceholderNote}</span></div>
          : <img src={invitation.photo} alt="Наше совместное фото" onError={() => setMissing(true)} />}
      </div>
      <p className="handwritten polaroid-caption">{invitation.texts.photoCaption}</p>
    </motion.div>
    <p className="body-copy photo-copy">{invitation.texts.photoNote}</p>
    <button className="button primary" onClick={onNext}>{invitation.texts.photoNext}<ArrowRight size={17} /></button>
  </section>
}
