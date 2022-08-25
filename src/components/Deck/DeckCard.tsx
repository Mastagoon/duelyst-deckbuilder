import { useEffect, useMemo, useRef, useState } from "react"
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
    <div>
      <div
        className="h-14 relative"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <div
          style={{
            backgroundImage: `url(/card/deck_builder_card_bg.png)`,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
            borderColor: getFactionColors(c.faction),
          }}
          className="flex flex-row justify-start items-center mb-1 rounded-md gap-2 cursor-pointer hover:border-b-2 hover:border-l-2  transition-all h-14 relative"
          onClick={() => clickCallBack(c.id)}
        >
          <span className="absolute text-lg font-bold left-[1.35rem] text-black">
            {c.mana}
          </span>
          <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-16 uppercase">
            {c.name}
          </span>
          <span className="absolute right-3 top-0 text-black bg-secondary-cyan rounded-sm h-6 w-6 translate-y-1/2 text-sm flex justify-center items-center">
            x{c.count}
          </span>
          <div
            className="absolute"
            style={{
              width: c.cardType.toUpperCase() === "MINION" ? "3.8rem" : "3rem",
              right:
                c.cardType.toUpperCase() === "MINION" ? "2.5rem" : "2.25rem",
              top: c.cardType.toUpperCase() === "MINION" ? "" : "0",
              height: c.cardType.toUpperCase() === "MINION" ? "5rem" : "3rem",
              backgroundSize: "auto auto",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(/card_sprites/${c.id}.png)`,
              opacity: 0.5,
            }}
          ></div>
        </div>
      </div>
      <CardTooltip c={c} show={showTooltip} />
    </div>
  )
}

export default DeckCard
