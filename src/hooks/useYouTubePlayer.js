import { useCallback, useEffect, useRef, useState } from 'react'

const API_SRC = 'https://www.youtube.com/iframe_api'
const CONTAINER_ID = 'yt-hidden-player'

let apiPromise = null
let playerInstance = null
let playerReady = false
let creatingForPlaylist = null
const subscribers = new Set()

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous()
      resolve(window.YT)
    }
    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const tag = document.createElement('script')
      tag.src = API_SRC
      tag.async = true
      document.head.appendChild(tag)
    }
  })
  return apiPromise
}

// A single hidden player is created once for the app's lifetime and shared
// across mounts. React 18's StrictMode intentionally mounts effects twice in
// dev, which — if we created/destroyed a real YT.Player per effect run —
// doubled how long the very first track took to start. Subscribers instead
// register for events on this one long-lived instance.
function ensurePlayer(playlistId) {
  if (playerInstance || creatingForPlaylist === playlistId) return
  creatingForPlaylist = playlistId

  if (!document.getElementById(CONTAINER_ID)) {
    const host = document.createElement('div')
    host.id = CONTAINER_ID
    host.style.position = 'fixed'
    host.style.bottom = '0'
    host.style.left = '0'
    host.style.width = '2px'
    host.style.height = '2px'
    host.style.opacity = '0'
    host.style.pointerEvents = 'none'
    document.body.appendChild(host)
  }

  loadYouTubeApi().then((YT) => {
    playerInstance = new YT.Player(CONTAINER_ID, {
      height: '2',
      width: '2',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        listType: 'playlist',
        list: playlistId,
      },
      events: {
        onReady: (event) => {
          playerReady = true
          // Browsers block autoplay-with-sound until the visitor has
          // interacted with the page, so this often gets silently ignored —
          // the interaction-triggered retry below is what actually starts
          // playback on a fresh load.
          event.target.playVideo()
          subscribers.forEach((fn) => fn('ready', event))
        },
        onStateChange: (event) => {
          subscribers.forEach((fn) => fn('stateChange', event))
        },
        onError: (event) => {
          subscribers.forEach((fn) => fn('error', event))
        },
      },
    })
  })
}

export function useYouTubePlayer(playlistId) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(playerReady)
  const [volume, setVolumeState] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [playlistError, setPlaylistError] = useState(false)
  const volumeRef = useRef(volume)
  volumeRef.current = volume

  const updateTrackFromPlayer = useCallback(() => {
    if (!playerInstance?.getVideoData) return
    const data = playerInstance.getVideoData()
    if (data?.video_id) {
      setCurrentTrack({
        videoId: data.video_id,
        title: data.title || 'Untitled track',
        artist: data.author || 'YouTube Music',
      })
    }
  }, [])

  useEffect(() => {
    const handleEvent = (type, event) => {
      if (type === 'ready') {
        setIsReady(true)
        playerInstance.setVolume(volumeRef.current)
        updateTrackFromPlayer()
      } else if (type === 'stateChange') {
        updateTrackFromPlayer()
        const YTns = window.YT
        if (event.data === YTns.PlayerState.PLAYING) setIsPlaying(true)
        if (event.data === YTns.PlayerState.PAUSED) setIsPlaying(false)
      } else if (type === 'error') {
        setPlaylistError(true)
        playerInstance?.nextVideo?.()
      }
    }

    subscribers.add(handleEvent)
    ensurePlayer(playlistId)
    if (playerReady) {
      setIsReady(true)
      updateTrackFromPlayer()
    }

    // Fallback for browsers that blocked the autoplay attempt in onReady:
    // start playback on the visitor's very first tap/click anywhere on the
    // page instead of leaving the player stuck paused until they find the
    // play button.
    const retryOnInteraction = () => {
      playerInstance?.playVideo?.()
      document.removeEventListener('touchstart', retryOnInteraction)
      document.removeEventListener('click', retryOnInteraction)
    }
    document.addEventListener('touchstart', retryOnInteraction, { once: true, passive: true })
    document.addEventListener('click', retryOnInteraction, { once: true })

    return () => {
      subscribers.delete(handleEvent)
      document.removeEventListener('touchstart', retryOnInteraction)
      document.removeEventListener('click', retryOnInteraction)
    }
  }, [playlistId, updateTrackFromPlayer])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      if (!playerInstance?.getCurrentTime) return
      setCurrentTime(playerInstance.getCurrentTime())
      setDuration(playerInstance.getDuration())
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlay = useCallback(() => {
    if (!playerInstance) return
    if (isPlaying) playerInstance.pauseVideo()
    else playerInstance.playVideo()
  }, [isPlaying])

  const next = useCallback(() => {
    playerInstance?.nextVideo?.()
  }, [])

  const prev = useCallback(() => {
    playerInstance?.previousVideo?.()
  }, [])

  const setVolume = useCallback(
    (value) => {
      setVolumeState(value)
      playerInstance?.setVolume?.(value)
      if (value === 0) {
        setIsMuted(true)
        playerInstance?.mute?.()
      } else if (isMuted) {
        setIsMuted(false)
        playerInstance?.unMute?.()
      }
    },
    [isMuted],
  )

  const toggleMute = useCallback(() => {
    if (!playerInstance) return
    if (isMuted) {
      playerInstance.unMute()
      setIsMuted(false)
    } else {
      playerInstance.mute()
      setIsMuted(true)
    }
  }, [isMuted])

  const seekTo = useCallback((seconds) => {
    playerInstance?.seekTo?.(seconds, true)
    setCurrentTime(seconds)
  }, [])

  return {
    currentTrack,
    isPlaying,
    isReady,
    volume,
    isMuted,
    currentTime,
    duration,
    playlistError,
    togglePlay,
    next,
    prev,
    setVolume,
    toggleMute,
    seekTo,
  }
}
