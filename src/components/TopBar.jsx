import { ArrowUpRight, Disc3 } from 'lucide-react'

export function TopBar({ clock, driverCount }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 grid grid-cols-3 items-center gap-2 px-3 py-4 sm:px-8 sm:py-6">
      <span className="justify-self-start text-xs font-normal text-white/75 sm:text-sm">
        {clock}
      </span>

      <div className="flex items-center gap-1.5 justify-self-center rounded-full border border-white/10 bg-black/30 px-2.5 py-1.5 backdrop-blur-md sm:gap-2 sm:px-4">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span className="whitespace-nowrap text-xs text-white/90 sm:text-sm">
          {driverCount} online
        </span>
      </div>

      <a
        href="https://music.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 justify-self-end text-xs font-medium text-white/90 transition-colors hover:text-white sm:text-sm"
      >
        <Disc3 size={14} />
        <span className="hidden sm:inline">YT Music</span>
        <ArrowUpRight size={14} className="opacity-70" />
      </a>
    </div>
  )
}
