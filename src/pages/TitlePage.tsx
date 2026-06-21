import { TitleScreen } from '@components/ui/TitleScreen'
import { useNavigate } from 'react-router-dom'

export function TitlePage() {
  const navigate = useNavigate()

  return (
    <TitleScreen
      onStart={() => {
        navigate('/menu')
      }}
    />
  )
}

