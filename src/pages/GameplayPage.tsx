import { useMemo } from 'react'
import { GameplayScene } from '@components/gameplay/oldGameplay/GameplayScene'
import { storageService } from '@services/storage/storageService'

export function GameplayPage() {
  const keybinds = useMemo(() => storageService.getKeybinds(), [])

  return <GameplayScene keybinds={keybinds} />
}

