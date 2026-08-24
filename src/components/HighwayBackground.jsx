import { useEffect, useRef, useState } from 'react'

const BG_VIDEO_SRC = `${import.meta.env.BASE_URL}truck-background.mp4`
const BG_IMAGE_SRC = `${import.meta.env.BASE_URL}truck-background.jpg`

export function HighwayBackground() {
  const [videoFailed, setVideoFailed] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || videoFailed) return

    // iOS Safari and some Android WebViews ignore the `muted` JSX attribute
    // unless it's also set as a DOM property before play() is attempted, and
    // can silently reject autoplay entirely even when muted. We force the
    // property here, then retry playback on the visitor's first touch/click
    // if the initial attempt was blocked.
    video.muted = true
    video.defaultMuted = true

    const attemptPlay = () => video.play().catch(() => {})
    attemptPlay()

    const retryOnInteraction = () => {
      attemptPlay()
      document.removeEventListener('touchstart', retryOnInteraction)
      document.removeEventListener('click', retryOnInteraction)
    }
    document.addEventListener('touchstart', retryOnInteraction, { once: true, passive: true })
    document.addEventListener('click', retryOnInteraction, { once: true })

    return () => {
      document.removeEventListener('touchstart', retryOnInteraction)
      document.removeEventListener('click', retryOnInteraction)
    }
  }, [videoFailed])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {!videoFailed ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={BG_VIDEO_SRC}
          poster={BG_IMAGE_SRC}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onError={() => setVideoFailed(true)}
        />
      ) : !imageFailed ? (
        <img
          src={BG_IMAGE_SRC}
          alt=""
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full origin-center animate-kenburns object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 h-full w-full animate-kenburns bg-gradient-to-b from-[#1a0f08] via-[#c96a2e] to-[#3a2010]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% 38%, rgba(255,170,80,0.55), transparent 60%), linear-gradient(to top, #0b0704 0%, #2b1608 35%, #d9743a 60%, #7a3418 100%)',
          }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/20" />
    </div>
  )
}
