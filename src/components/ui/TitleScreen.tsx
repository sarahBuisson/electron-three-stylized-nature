import { useEffect } from 'react'

interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onStart()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onStart])

  return (
    <section className="title-screen" onClick={onStart}>
      <h1>Abstract Hiking</h1>
      <p>press Enter</p>
    </section>
  )
}

