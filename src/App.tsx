import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, Heart, Mail, X } from 'lucide-react'
import { invitation, screenOrder, type Screen } from './config/invitation'
import { useInvitation } from './hooks/useInvitation'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { EnvelopeScreen } from './components/EnvelopeScreen'
import { LetterScreen } from './components/LetterScreen'
import { PhotoScreen } from './components/PhotoScreen'
import { InvitationScreen } from './components/InvitationScreen'
import { DateDetailsScreen } from './components/DateDetailsScreen'
import { QuestionnaireScreen } from './components/QuestionnaireScreen'
import { FinalScreen } from './components/FinalScreen'
import { FloatingHearts } from './components/FloatingHearts'
import { HeartBursts } from './components/HeartBursts'
import { MusicToggle } from './components/MusicToggle'

const order: readonly Screen[] = screenOrder
export default function App() {
  const { screen, setScreen, answers, setAnswers, storageError } = useInvitation()
  const [closed, setClosed] = useState(false)
  const [notice, setNotice] = useState('')
  const main = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const index = order.indexOf(screen)
  const go = useCallback((next: Screen) => { setScreen(next) }, [setScreen])
  const next = useCallback(() => { setScreen(current => order[Math.min(order.indexOf(current) + 1, order.length - 1)]) }, [setScreen])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen, closed])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 6500)
    return () => window.clearTimeout(timer)
  }, [notice])
  useEffect(() => { if (storageError) setNotice(invitation.texts.storageUnavailable) }, [storageError])
  return <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
    <div className={`app ${screen === 'final' && !closed ? 'final-theme' : ''}`}>
      <a className="skip-link" href="#main">К приглашению</a>
      <header className="site-header">
        <div className="brand"><Heart size={18} strokeWidth={1.3} /><span>{invitation.brand}</span><span className="brand-divider" /><span className="brand-for">for {invitation.texts.englishName}</span></div>
        <div className="header-actions">
          {!closed && index > 1 && <button className="icon-button" aria-label={invitation.texts.readLetter} title={invitation.texts.readLetter} onClick={() => go('letter')}><Mail size={18} /></button>}
          <MusicToggle onNotice={setNotice} paused={closed} />
          {!closed && <button className="icon-button close-button" aria-label={invitation.texts.close} title={invitation.texts.close} onClick={() => setClosed(true)}><X size={17} /></button>}
        </div>
      </header>
      <FloatingHearts paused={closed} />
      <HeartBursts active={!closed} />
      <main id="main" ref={main}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="screen-container" key={closed ? 'closed' : screen}
            initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={{ duration: reduced ? 0 : invitation.animation.transition }} onAnimationComplete={() => {
              const heading = main.current?.querySelector('h1')
              heading?.setAttribute('tabindex', '-1')
              heading?.focus({ preventScroll: true })
            }}>
            {closed ? <section className="screen pause-screen"><Heart size={40} strokeWidth={1} /><h1 tabIndex={-1}>{invitation.texts.pauseTitle}</h1><p className="body-copy">{invitation.texts.pauseNote}</p><button className="button primary" onClick={() => setClosed(false)}>{invitation.texts.reopen}</button></section>
              : screen === 'envelope' ? <EnvelopeScreen onNext={next} />
              : screen === 'letter' ? <LetterScreen onNext={next} />
              : screen === 'photo' ? <PhotoScreen onNext={next} />
              : screen === 'invitation' ? <InvitationScreen onNext={next} />
              : screen === 'details' ? <DateDetailsScreen onNext={next} />
              : screen === 'questionnaire' ? <QuestionnaireScreen answers={answers} setAnswers={setAnswers} onFinish={() => go('final')} />
              : <FinalScreen answers={answers} onEdit={() => go('questionnaire')} onNotice={setNotice} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="site-footer">
        {!closed && <>
          <button className={`text-button footer-back ${index === 0 ? 'invisible' : ''}`} disabled={index === 0} onClick={() => go(order[index - 1])}><ArrowLeft size={14} /><span>{invitation.texts.back}</span></button>
          <ol className="journey-progress" aria-label="Этапы приглашения">{order.map((item, i) => <li key={item} aria-current={screen === item ? 'step' : undefined} className={i <= index ? 'active' : ''}><span className="progress-dot" /><span className="sr-only">{invitation.texts.stages[i]}</span></li>)}</ol>
          <span className="footer-page">{String(index + 1).padStart(2, '0')}<span> / {String(order.length).padStart(2, '0')}</span></span>
        </>}
        <span className="footer-signature">{invitation.texts.siteSignature}</span>
      </footer>
      <AnimatePresence>{notice && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}><span>{notice}</span><button className="icon-button" aria-label="Закрыть сообщение" onClick={() => setNotice('')}><X size={16} /></button></motion.div>}</AnimatePresence>
    </div>
  </MotionConfig>
}
