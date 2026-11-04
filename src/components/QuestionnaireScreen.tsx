import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarDays, Check, Coffee, Heart, Sparkles } from 'lucide-react'
import { invitation, type Answers } from '../config/invitation'
import { formatDate, isValidDate, localISO, nextWeekday } from '../lib/date'
import { DateCard } from './DateCard'

interface Props { answers: Answers; setAnswers: Dispatch<SetStateAction<Answers>>; onFinish: () => void }
export function QuestionnaireScreen({ answers, setAnswers, onFinish }: Props) {
  const [step, setStep] = useState(0)
  const [custom, setCustom] = useState(false)
  const [days] = useState(() => invitation.days.map(day => ({ ...day, date: nextWeekday(day.weekday) })))
  const calendar = useRef<HTMLInputElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [step])
  const valid = step === 0 ? isValidDate(answers.date) : !!answers.mood
  function choose(date: string) { setAnswers(current => ({ ...current, date })) }
  function changeStep(next: number) { setStep(next) }
  function openCalendar() {
    setCustom(true)
    // Native input remains visible for browsers without showPicker (including older Safari).
    requestAnimationFrame(() => {
      calendar.current?.focus()
      try { calendar.current?.showPicker() } catch { /* Native date input remains usable. */ }
    })
  }
  return <section className="screen questionnaire-screen">
    <p className="eyebrow">{invitation.texts.quizTitle}</p>
    <div className="quiz-progress" aria-label={`Вопрос ${step + 1} из 3`}>
      {[0, 1, 2].map(index => <span key={index} className={index <= step ? 'active' : ''} />)}<span className="quiz-counter">0{step + 1} / 03</span>
    </div>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div className="quiz-panel" key={step} initial={{ opacity: 0, x: reduced ? 0 : 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -15 }} transition={{ duration: reduced ? 0 : invitation.animation.transition }} onAnimationComplete={() => heading.current?.focus({ preventScroll: true })}>
        <h1 className="quiz-title" ref={heading} tabIndex={-1}>{step === 0 ? invitation.texts.dayQuestion : step === 1 ? invitation.texts.moodQuestion : invitation.texts.confirmQuestion}</h1>
        {step === 0 && <>
          <div className="choices" role="radiogroup" aria-label={invitation.texts.dayQuestion}>
            {days.map(({ date, label, short, note }) => <label className={`choice ${answers.date === date && !custom ? 'selected' : ''}`} key={short}>
              <input type="radio" name="day" value={date} checked={answers.date === date && !custom} onChange={() => { choose(date); setCustom(false) }} />
              <CalendarDays size={21} strokeWidth={1.2} /><span><span className="choice-title">{label}</span><span className="choice-note">{formatDate(date, false)}{note && <span className="text-wine"> · {note}</span>}</span></span><span className="choice-check">{answers.date === date && !custom && <Check size={13} />}</span>
            </label>)}
            <button className={`choice ${custom || (!!answers.date && !days.some(day => day.date === answers.date)) ? 'selected' : ''}`} onClick={openCalendar}>
              <CalendarDays size={21} strokeWidth={1.2} /><span><span className="choice-title">{invitation.texts.otherDate}</span><span className="choice-note">{invitation.texts.otherDateNote}</span></span><ArrowRight size={16} />
            </button>
          </div>
          {(custom || (!!answers.date && !days.some(day => day.date === answers.date))) && <label className="calendar-label">{invitation.texts.calendarLabel}<input ref={calendar} type="date" aria-label="Удобная дата" min={localISO()} value={answers.date} onChange={event => choose(event.target.value)} /></label>}
        </>}
        {step === 1 && <div className="choices" role="radiogroup" aria-label="Настроение вечера">
          {invitation.moods.map((mood, index) => {
            const Icon = [Coffee, Heart, Sparkles][index]
            return <label className={`choice ${answers.mood === mood.id ? 'selected' : ''}`} key={mood.id}>
              <input type="radio" name="mood" value={mood.id} checked={answers.mood === mood.id} onChange={() => setAnswers(current => ({ ...current, mood: mood.id }))} />
              <Icon size={22} strokeWidth={1.2} /><span><span className="choice-title">{mood.label}</span><span className="choice-note">{mood.note}</span></span><span className="choice-check">{answers.mood === mood.id && <Check size={13} />}</span>
            </label>
          })}
        </div>}
        {step === 2 && <DateCard answers={answers} compact />}
        <div className="quiz-actions">
          {step > 0 && <button className="text-button" onClick={() => changeStep(step - 1)}><ArrowLeft size={15} />{invitation.texts.back}</button>}
          <button className="button primary" disabled={!valid || (step === 2 && !isValidDate(answers.date))} onClick={() => step < 2 ? changeStep(step + 1) : onFinish()}>
            {step === 2 ? invitation.texts.confirm : invitation.texts.next}{step < 2 && <ArrowRight size={17} />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
    <p className="quiz-footnote">{invitation.texts.quizFootnote}</p>
  </section>
}
