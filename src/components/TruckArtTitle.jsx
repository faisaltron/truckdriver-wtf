export function TruckArtTitle() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      <img
        src={`${import.meta.env.BASE_URL}title.png`}
        alt="Safar-e-Ishq"
        className="h-auto w-[280px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] sm:w-[440px]"
      />
    </div>
  )
}
