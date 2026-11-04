import { CalendarDays, Clock3, Gift, Heart } from 'lucide-react'
import { invitation, type Answers } from '../config/invitation'
import { formatDate } from '../lib/date'

export function DateCard({ answers, compact = false }: { answers?: Answers; compact?: boolean }) {
  const rows = [
    { Icon: Gift, label: 'МЕСТО', value: invitation.cafe, note: invitation.texts.placeNote },
    { Icon: Clock3, label: 'ВРЕМЯ', value: invitation.time, note: invitation.texts.timeNote },
    ...(answers ? [{ Icon: CalendarDays, label: 'ДЕНЬ', value: formatDate(answers.date), note: '' }] : []),
    { Icon: Heart, label: 'КОМПАНИЯ', value: invitation.texts.company, note: invitation.texts.companyNote },
  ]
  return <div className={`date-card ${compact ? 'compact' : ''}`}>
    <div className="date-card-heading"><span>{invitation.texts.cardTitle}</span><Heart size={15} strokeWidth={1.2} /></div>
    {rows.map(({ Icon, label, value, note }) => <div className="date-row" key={label}>
      <span className="date-icon"><Icon size={21} strokeWidth={1.3} /></span>
      <div><span className="detail-label">{label}</span><p className="detail-value">{value}</p>{!compact && note && <p className="detail-note">{note}</p>}</div>
    </div>)}
    {answers?.mood && <p className="card-mood">{invitation.moods.find(mood => mood.id === answers.mood)?.label}</p>}
    <div className="card-bottom" aria-hidden="true"><span />♡<span /></div>
  </div>
}
