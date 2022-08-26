import { useEffect, useRef, useState } from "react"
import { allCards, CardData, cardDataById } from "../data/cards"
import getFactionColor from "../utils/getFactionColor"
import CardAttack from "./Card/CardAttack"
import CardDescription from "./Card/CardDescription"
import CardHealth from "./Card/CardHealth"

const CardTooltip: React.FC<{
  c: CardData
  show: boolean
  nested: boolean
}> = ({ show, c, nested }) => {
  const [isAtEdge, setIsAtEdge] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (
      tooltipRef.current &&
      tooltipRef.current.getBoundingClientRect().top > 500
    )
      setIsAtEdge(true)
  }, [show, tooltipRef])

  if (!show) return <></>

  return (
    <div
      ref={tooltipRef}
      style={{
        bottom: isAtEdge ? "-100px" : "inherit",
        zIndex: 200,
        transform: nested
          ? `translate(-108%, -100%)`
          : "translate(-100%, -50%)",
      }}
      className="fixed"
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
      {/* related cards */}
      {!nested &&
        c.relatedCards.map((r) =>
          cardDataById[r] ? (
            <CardTooltip c={cardDataById[r]!} show={true} nested={true} />
          ) : null
        )}
    </div>
  )
}
export default CardTooltip
