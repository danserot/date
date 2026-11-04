import { ArrowRight, Heart } from 'lucide-react'
import { invitation } from '../config/invitation'

export function LetterScreen({ onNext }: { onNext: () => void }) {
  const { texts } = invitation

  return <section className="screen letter-screen">
    <p className="eyebrow">{texts.letterEyebrow}</p>
    <article className="love-letter" aria-labelledby="letter-heading">
      <div className="letter-topline" aria-hidden="true"><span /> <Heart size={20} strokeWidth={1} /> <span /></div>
      <h1 id="letter-heading" tabIndex={-1}>{texts.letterGreeting}</h1>
      <div className="letter-body">
        {texts.letterParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <p className="handwritten letter-closing">{texts.letterClosing}{' '}<Heart className="letter-closing-heart" size={25} strokeWidth={1.4} aria-hidden="true" /></p>
      <div className="letter-fold" aria-hidden="true" />
    </article>
    <button className="button primary letter-next" onClick={onNext}>{texts.letterNext}<ArrowRight size={18} /></button>
  </section>
}
