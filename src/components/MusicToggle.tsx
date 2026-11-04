import { useEffect, useRef, useState } from 'react'
import { Music2, Volume2 } from 'lucide-react'
import { invitation } from '../config/invitation'

export function MusicToggle({ onNotice, paused }: { onNotice: (text: string) => void; paused: boolean }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => () => { audio.current?.pause() }, [])
  useEffect(() => {
    if (paused) { audio.current?.pause(); setPlaying(false) }
  }, [paused])
  async function toggle() {
    if (playing) { audio.current?.pause(); setPlaying(false); return }
    if (loading || paused) return
    setLoading(true)
    if (!audio.current) {
      audio.current = new Audio(invitation.music)
      audio.current.loop = true
      audio.current.volume = 0.28
    }
    try { await audio.current.play(); setPlaying(true) }
    catch { onNotice(invitation.texts.musicMissing) }
    finally { setLoading(false) }
  }
  return <button className={`icon-button music-button ${playing ? 'is-playing' : ''}`} onClick={toggle}
    disabled={loading || paused} aria-label={playing ? invitation.texts.musicOn : invitation.texts.musicOff}
    aria-pressed={playing} title={playing ? invitation.texts.musicOn : invitation.texts.musicOff}>
    {playing ? <Volume2 size={17} /> : <Music2 size={17} />}
  </button>
}
