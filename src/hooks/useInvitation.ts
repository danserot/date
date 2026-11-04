import { useEffect, useState } from 'react'
import { invitation, screenOrder, type Answers, type Screen } from '../config/invitation'
import { isValidDate } from '../lib/date'

const screens: readonly Screen[] = screenOrder
function readSaved(): { screen: Screen; answers: Answers } {
  const initial = { screen: 'envelope' as Screen, answers: { date: '', mood: '' } as Answers }
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(invitation.storageKey) || 'null')
    if (!saved || typeof saved !== 'object' || !('answers' in saved) || !('screen' in saved)) return initial
    const data = saved as { screen: unknown; answers: Partial<Answers> }
    if (!data.answers || typeof data.answers !== 'object') return initial
    const date = isValidDate(data.answers.date) ? data.answers.date : ''
    const mood = invitation.moods.some(item => item.id === data.answers.mood) ? data.answers.mood! : ''
    const screen = screens.includes(data.screen as Screen) ? data.screen as Screen : 'envelope'
    return { screen: screen === 'final' && (!date || !mood) ? 'questionnaire' : screen, answers: { date, mood } }
  } catch { return initial }
}

export function useInvitation() {
  const [saved] = useState(readSaved)
  const [screen, setScreen] = useState<Screen>(saved.screen)
  const [answers, setAnswers] = useState<Answers>(saved.answers)
  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem(invitation.storageKey, JSON.stringify({ screen, answers }))
    } catch { setStorageError(true) }
  }, [screen, answers])
  return { screen, setScreen, answers, setAnswers, storageError }
}
