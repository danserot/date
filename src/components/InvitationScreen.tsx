import { useEffect, useState } from 'react'
import { Coffee, Heart, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitation } from '../config/invitation'
import { FloatingHearts } from './FloatingHearts'
import { RunawayButton } from './RunawayButton'

export function InvitationScreen({ onNext }: { onNext: () => void }) {
  const [attempts, setAttempts] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!accepted) return
    const timer = window.setTimeout(onNext, invitation.animation.celebrationMs)
    return () => window.clearTimeout(timer)
  }, [accepted, onNext])
  return <section className="screen invitation-screen">
    {accepted && <FloatingHearts celebration />}
    <div className="coffee-art" aria-hidden="true"><span className="coffee-ring" /><Coffee size={65} strokeWidth={0.9} /><Heart className="coffee-heart" size={22} strokeWidth={1.2} /><span className="handwritten">{invitation.texts.coffeeCaption}</span></div>
    <p className="eyebrow">{invitation.texts.questionEyebrow}</p>
    <h1 className="question-title" aria-live="polite">{accepted ? invitation.texts.accepted : <><em>{invitation.name},</em><br />{invitation.texts.question} <span className="title-heart">♡</span></>}</h1>
    <p className="body-copy">{accepted ? invitation.texts.acceptedNote : invitation.texts.promise}</p>
    {!accepted && <>
      <div className="answer-buttons">
        <motion.button className="button primary yes-button" onClick={() => setAccepted(true)}
          animate={{ scale: reduced ? 1 : 1 + Math.min(attempts, 5) * 0.035 }} whileTap={{ scale: 0.98 }}>{invitation.texts.yes}<Heart size={16} /></motion.button>
        <RunawayButton attempts={attempts} onDodge={() => setAttempts(value => value + 1)} />
      </div>
      <p className="dodge-message handwritten" aria-live="polite">{attempts > 0 ? invitation.texts.runaway[Math.min(attempts - 1, invitation.texts.runaway.length - 1)] : '\u00a0'}</p>
      <p className="consent-note">{invitation.texts.consent}</p>
    </>}
    {accepted && <Sparkles className="accepted-sparkles" size={30} strokeWidth={1} />}
  </section>
}
