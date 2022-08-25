import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { DeckCardEntry } from "../../context/newDeckContext"
import getFactionColors from "../../utils/getFactionColor"
import CardTooltip from "../CardTooltip"

const DeckCard: React.FC<{
  c: DeckCardEntry
  clickCallBack: (id: number) => void
}> = ({ c, clickCallBack }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleOnMouseEnter = () => {
    setShowTooltip(true)
  }

  const handleOnMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <div
        style={{
          borderColor: getFactionColors(c.faction),
        }}
        className="flex flex-row justify-start h-14 items-center mb-1 rounded-md gap-2 cursor-pointer hover:border-b-2 hover:border-l-2  transition-all min-h-fit relative bg-cover"
        onClick={() => clickCallBack(c.id)}
      >
        <Image
          src={"/card/deck_builder_card_bg.png"}
          className="z-0"
          layout="fill"
        />
        <span className="absolute text-lg font-bold left-[7%] text-black">
          {c.mana}
        </span>
        <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-[20%] uppercase z-10">
          {c.name}
        </span>
        <span className="absolute right-3 top-0 text-black bg-secondary-cyan rounded-sm h-6 w-6 translate-y-1/2 text-sm flex justify-center items-center">
          x{c.count}
        </span>
        <div
          className="absolute"
          style={{
            width: c.cardType.toUpperCase() === "MINION" ? "15%" : "16%",
            right: "13%",
            height: "100%",
            backgroundSize: "auto auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(/card_sprites/${c.id}.png)`,
            opacity: 0.5,
          }}
        ></div>
      </div>
      <CardTooltip nested={false} c={c} show={showTooltip} />
    </div>
  )
}

export default DeckCard
