const CardHealth: React.FC<{ health: number; className?: string }> = ({
  health,
  className,
}) => {
  return (
    <div
      className={`rounded-full bg-health-icon border-2 border-white flex flex-col items-center justify-center ${className}`}
    >
      <span className="inline-block w-6 text-center text-md font-bold rounded-full">
        {health}
      </span>
    </div>
  )
}

export default CardHealth
