import { useEffect, useMemo, useRef, useState } from "react"
import { DeckCardEntry } from "../../context/newDeckContext"
import getFactionColor from "../../utils/getFactionColor"
import getFactionColors from "../../utils/getFactionColor"
import CardAttack from "../Card/CardAttack"
import CardDescription from "../Card/CardDescription"
import CardHealth from "../Card/CardHealth"

const DeckCard: React.FC<{
  c: DeckCardEntry
  clickCallBack: (id: number) => void
}> = ({ c, clickCallBack }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isAtEdge, setIsAtEdge] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      tooltipRef.current &&
      tooltipRef.current.getBoundingClientRect().top > 500
    )
      setIsAtEdge(true)
  }, [showTooltip, tooltipRef])

  const CardTooltip = () => {
    return (
      <div
        ref={tooltipRef}
        style={{
          display: showTooltip ? "visible" : "none",
          bottom: isAtEdge ? "-100px" : "inherit",
        }}
        className="fixed -translate-x-full -translate-y-1/2"
      >
        <div className="flex flex-col justify-center items-center">
          <div
            style={{
              border: `1px solid ${getFactionColor(c.faction)}`,
            }}
            className="w-52 h-full card-border cursor-pointer transition-all mr-2 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] p-1 select-none bg-no-repeat bg-cover text-center"
          >
            <div
              className="flex-1 pixelated animation-fade animate-slideInFromBottom"
              style={{
                //@ts-ignore
                backgroundImage: `url(/card_sprites/${c.id}.gif)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `${
                  ["MINION", "GENERAL"].includes(c.cardType.toUpperCase())
                    ? "center 10%"
                    : "center"
                }`,
                backgroundSize: `${
                  ["MINION", "GENERAL"].includes(c.cardType.toUpperCase())
                    ? "100%"
                    : "75%"
                }`,
              }}
            ></div>
            <span className="text-primary-cyan capitalize">
              <CardDescription description={c.description ?? ""} />
            </span>
            {c.attack || c.health ? (
              <>
                <CardAttack
                  attack={c.attack ?? 0}
                  className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 h-10 w-10"
                />
                <CardHealth
                  health={c.health ?? 0}
                  className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-10 w-10"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

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
      <CardTooltip />
    </div>
  )
}

export default DeckCard
