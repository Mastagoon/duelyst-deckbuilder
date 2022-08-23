const ManaGem: React.FC<{ cost: number; className?: string }> = ({
  cost,
  className,
}) => {
  return (
    <div
      className={`mana-gem hexagon-shadow  bg-primary-light-blue text-slate-900 flex flex-col items-center justify-center ${className}`}
    >
      <span className="inline-block w-6 text-center text-lg font-bold">
        {cost}
      </span>
    </div>
  )
}

export default ManaGem
