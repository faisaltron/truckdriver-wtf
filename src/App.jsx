import { HighwayBackground } from './components/HighwayBackground.jsx'
import { TopBar } from './components/TopBar.jsx'
import { TruckArtTitle } from './components/TruckArtTitle.jsx'
import { AudioCard } from './components/AudioCard.jsx'
import { useYouTubePlayer } from './hooks/useYouTubePlayer.js'
import { useDriverCounter } from './hooks/useDriverCounter.js'
import { useClock } from './hooks/useClock.js'
import { PLAYLIST_ID } from './config.js'

export default function App() {
  const player = useYouTubePlayer(PLAYLIST_ID)
  const drivers = useDriverCounter()
  const clock = useClock()

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black font-sans">
      <HighwayBackground />
      <TopBar clock={clock} driverCount={drivers.count} />
      <TruckArtTitle />
      <AudioCard player={player} />
    </div>
  )
}
