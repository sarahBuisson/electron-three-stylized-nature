/* eslint-disable react-refresh/only-export-components */
// Context file: intentionally exports hook + provider + context together
import { createContext, useContext, useState, type ReactNode } from 'react'
import  { RapierRigidBody } from '@react-three/rapier'

interface PlayerContextType {
  playerRigidBody: RapierRigidBody | null
  setPlayerRigidBody: (rb: RapierRigidBody | null) => void
}


export const PlayerContext: React.Context<PlayerContextType> = createContext<PlayerContextType>({
  playerRigidBody: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPlayerRigidBody: () => {},
})

export function usePlayerRigidBody()  : PlayerContextType {
  return useContext(PlayerContext)
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerRigidBody, setPlayerRigidBody] = useState<RapierRigidBody | null>(null)
  return (
    <PlayerContext.Provider value={{ playerRigidBody, setPlayerRigidBody }}>
      {children}
    </PlayerContext.Provider>
  )
}



