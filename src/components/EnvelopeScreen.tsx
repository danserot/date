import { useEffect, useState } from 'react'
import { Heart, MoveUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitation } from '../config/invitation'

export function EnvelopeScreen({ onNext }: { onNext: () => void }) {
  const [opening, setOpening] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!opening) return
    const timer = window.setTimeout(onNext, reduced ? 150 : invitation.animation.envelopeMs)
    return () => window.clearTimeout(timer)
  }, [opening, onNext, reduced])
  return <section className="screen envelope-screen">
    <p className="eyebrow">{invitation.texts.introEyebrow}</p>
    <h1 className="intro-title"><span>{invitation.texts.forYou}</span><br /><em>{invitation.texts.englishName}</em> <span className="title-heart">♡</span></h1>
    <div className="envelope-stage">
      <span className="handwritten envelope-aside">{invitation.texts.envelopeAside} <MoveUpRight size={27} strokeWidth={1} /></span>
      <motion.button className={`envelope ${opening ? 'is-opening' : ''}`} onClick={() => setOpening(true)}
        aria-label={invitation.texts.envelopeLabel} disabled={opening} whileHover={!opening && !reduced ? { y: -5, rotate: -1 } : {}} whileTap={{ scale: 0.98 }}>
        <span className="envelope-back" />
        <span className="letter"><span className="letter-ornament">♡</span><span className="handwritten">Для тебя, {invitation.name}</span><span className="letter-line" /><span className="letter-line short" /></span>
        <span className="envelope-flap" />
        <span className="envelope-front" />
        <span className="envelope-seal"><Heart size={27} strokeWidth={1.1} /></span>
        <span className="envelope-address">{invitation.texts.envelopeSignature}</span>
      </motion.button>
    </div>
    <p className="intro-note">{invitation.texts.intro}</p>
    <p className="open-hint"><span className="hint-line" />{opening ? invitation.texts.envelopeLoading : invitation.texts.open}<span className="hint-line" /></p>
    <div className="private-note"><Heart size={12} /> {invitation.texts.private}</div>
  </section>
}
