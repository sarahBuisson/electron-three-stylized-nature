import { useNavigate } from 'react-router-dom'
import { TitleScreen } from '@components/ui/TitleScreen'
import { ROUTES } from '@services/game/flowService'

export function TitlePage() {
  const navigate = useNavigate()
  return <TitleScreen onStart={() => navigate(ROUTES.menu)} />
}

