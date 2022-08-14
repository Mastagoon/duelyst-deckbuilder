const CardAttack: React.FC<{ attack: number; className?: string }> = ({
  attack,
  className,
}) => {
  return (
    <div
      className={`rounded-full bg-attack-icon border-2 border-white flex flex-col items-center justify-center ${className}`}
    >
      <span className="inline-block w-6 text-center text-md font-bold rounded-full">
        {attack}
      </span>
    </div>
  )
}

export default CardAttack
