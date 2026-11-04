import { ArrowRight } from 'lucide-react'
import { invitation } from '../config/invitation'
import { DateCard } from './DateCard'

export function DateDetailsScreen({ onNext }: { onNext: () => void }) {
  return <section className="screen details-screen">
    <p className="eyebrow">{invitation.texts.detailsEyebrow}</p>
    <h1><em>{invitation.texts.details}</em> <span className="title-heart">♡</span></h1>
    <p className="body-copy">{invitation.texts.detailsNote}</p>
    <DateCard />
    <p className="handwritten details-footer">{invitation.texts.detailsFooter}</p>
    <button className="button primary" onClick={onNext}>{invitation.texts.chooseDay}<ArrowRight size={17} /></button>
  </section>
}
