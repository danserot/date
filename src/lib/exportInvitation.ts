import { invitation, type Answers } from '../config/invitation'
import { formatDate } from './date'

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let line = ''
  for (const word of text.split(' ')) {
    const next = `${line}${line ? ' ' : ''}${word}`
    if (ctx.measureText(next).width > maxWidth && line) { ctx.fillText(line, x, y); y += lineHeight; line = word }
    else line = next
  }
  ctx.fillText(line, x, y)
  return y + lineHeight
}

export async function exportInvitation(answers: Answers): Promise<void> {
  await document.fonts.ready
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 1600
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.fillStyle = '#FFF9F5'; ctx.fillRect(0, 0, 1200, 1600)
  ctx.strokeStyle = '#E9D2D3'; ctx.lineWidth = 2; ctx.strokeRect(55, 55, 1090, 1490)
  ctx.textAlign = 'center'; ctx.fillStyle = '#A64B5C'
  ctx.font = '120px serif'; ctx.fillText('♡', 600, 240)
  ctx.font = '28px "DM Sans", sans-serif'; ctx.fillText(invitation.texts.cardTitle, 600, 340)
  ctx.font = '78px "Playfair Display", serif'; ctx.fillText(`${invitation.name}, ${invitation.texts.exportTitle}`, 600, 475)
  ctx.fillStyle = '#F8DDE3'; ctx.beginPath(); ctx.roundRect(135, 565, 930, 700, 24); ctx.fill()
  ctx.fillStyle = '#382B2D'; ctx.font = '64px "Playfair Display", serif'; ctx.fillText(invitation.cafe, 600, 690)
  ctx.font = '38px Manrope, sans-serif'; ctx.fillText(invitation.time, 600, 800)
  let y = wrapText(ctx, formatDate(answers.date), 600, 900, 780, 55)
  ctx.font = '48px Caveat, cursive'; ctx.fillStyle = '#A64B5C'; ctx.fillText(invitation.texts.company, 600, y + 45)
  ctx.font = '30px Manrope, sans-serif'; ctx.fillStyle = '#695255'
  wrapText(ctx, invitation.moods.find(mood => mood.id === answers.mood)?.label ?? '', 600, y + 145, 770, 45)
  ctx.font = '44px Caveat, cursive'; ctx.fillStyle = '#A64B5C'; ctx.fillText(invitation.texts.exportFooter, 600, 1390)
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Export failed')), 'image/png'))
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = `our-little-date-${answers.date}.png`
  document.body.appendChild(link); link.click(); link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function telegramShareUrl(answers: Answers): string {
  const mood = invitation.moods.find(item => item.id === answers.mood)?.label ?? ''
  const text = `${invitation.texts.shareIntro}\n\nДата: ${formatDate(answers.date)}\nВремя: ${invitation.time.toLowerCase()}\nМесто: ${invitation.cafe}\nПлан: ${mood}`
  return `https://t.me/share/url?url=${encodeURIComponent(window.location.origin + window.location.pathname)}&text=${encodeURIComponent(text)}`
}
