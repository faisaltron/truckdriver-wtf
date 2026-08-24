import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function AudioCard({ player }) {
  const track = player.currentTrack
  const hasVideo = Boolean(track?.videoId)
  const thumbnail = hasVideo ? `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg` : null
  const progress = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0

  let titleText = 'Loading playlist…'
  let artistText = ''
  if (player.playlistError && !hasVideo) {
    titleText = "Couldn't load playlist"
    artistText = 'check the playlist ID in src/config.js'
  } else if (hasVideo) {
    titleText = track.title
    artistText = track.artist
  }

  const handleSeek = (e) => {
    if (!player.duration) return
    const pct = Number(e.target.value)
    player.seekTo((pct / 100) * player.duration)
  }

  return (
    <div className="absolute bottom-10 left-1/2 z-30 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 px-2">
      <div className="relative overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative flex items-center gap-4 px-4 py-3 sm:gap-5 sm:px-6 sm:py-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/25 shadow-lg sm:h-16 sm:w-16">
            <div
              className={`h-full w-full ${player.isPlaying ? 'animate-spinSlow' : ''}`}
              style={{ animationPlayState: player.isPlaying ? 'running' : 'paused' }}
            >
              {thumbnail ? (
                <img src={thumbnail} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-red-700 text-xl">
                  🚛
                </div>
              )}
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-1 ring-white/20" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 sm:gap-6">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white sm:text-base">{titleText}</p>
                <p className="truncate text-xs text-white/60 sm:text-sm">{artistText}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={player.prev}
                  className="text-white/70 transition-colors hover:text-white"
                  aria-label="Previous track"
                >
                  <SkipBack size={18} />
                </button>
                <button
                  type="button"
                  onClick={player.togglePlay}
                  disabled={!hasVideo}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform active:scale-95 disabled:opacity-40 sm:h-10 sm:w-10"
                  aria-label={player.isPlaying ? 'Pause' : 'Play'}
                >
                  {player.isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={player.next}
                  className="text-white/70 transition-colors hover:text-white"
                  aria-label="Next track"
                >
                  <SkipForward size={18} />
                </button>

                <button
                  type="button"
                  onClick={player.toggleMute}
                  className="ml-1 hidden text-white/70 transition-colors hover:text-white sm:inline-flex"
                  aria-label={player.isMuted ? 'Unmute' : 'Mute'}
                >
                  {player.isMuted || player.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={player.volume}
                  onChange={(e) => player.setVolume(Number(e.target.value))}
                  className="hidden h-1 w-16 accent-orange-400 sm:block sm:w-20"
                  aria-label="Volume"
                />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={handleSeek}
                className="h-1 flex-1 accent-orange-400"
                aria-label="Seek"
              />
              <span className="shrink-0 text-[10px] tabular-nums text-white/50">
                {formatTime(player.currentTime)} / {formatTime(player.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
