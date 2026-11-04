import { useState } from 'react'
import { Download, Heart, Send } from 'lucide-react'
import { invitation, type Answers } from '../config/invitation'
import { exportInvitation, telegramShareUrl } from '../lib/exportInvitation'
import { DateCard } from './DateCard'

interface Props { answers: Answers; onEdit: () => void; onNotice: (text: string) => void }
export function FinalScreen({ answers, onEdit, onNotice }: Props) {
  const [saving, setSaving] = useState(false)
  async function save() {
    setSaving(true)
    try { await exportInvitation(answers); onNotice(invitation.texts.saved) }
    catch { onNotice(invitation.texts.saveError) }
    finally { setSaving(false) }
  }
  return <section className="screen final-screen">
    <div className="final-heart" aria-hidden="true"><Heart size={30} strokeWidth={1} /></div>
    <p className="eyebrow">{invitation.texts.finalEyebrow}</p>
    <h1><em>{invitation.name},</em><br />{invitation.texts.final}</h1>
    <p className="body-copy">{invitation.texts.finalNote}</p>
    <DateCard answers={answers} compact />
    <div className="final-actions">
      <a className="button primary" href={telegramShareUrl(answers)} target="_blank" rel="noopener noreferrer"><Send size={16} />{invitation.texts.share}</a>
      <button className="button secondary" onClick={save} disabled={saving}><Download size={16} />{saving ? invitation.texts.saving : invitation.texts.save}</button>
    </div>
    <button className="text-button edit-button" onClick={onEdit}>{invitation.texts.edit}</button>
    <p className="handwritten final-footer">{invitation.texts.finalFooter}</p>
  </section>
}
