const ManaGem: React.FC<{ cost: number; className?: string }> = ({
  cost,
  className,
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(/card/icon_mana.png)`,
        backgroundPosition: "center",
      }}
      className={`text-slate-900 flex h-14 flex-col items-center justify-center ${className}`}
    >
      <span className="inline-block w-6 text-center text-lg font-bold">
        {cost}
      </span>
    </div>
  )
}

export default ManaGem
