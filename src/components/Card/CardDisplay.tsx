import { CardData } from "../../data/cards"
import CardAttack from "./CardAttack"
import CardHealth from "./CardHealth"
import ManaGem from "./ManaGem"
import Image from "next/image"
import CardDescription from "./CardDescription"
import constants from "../../data/constants"
import getFactionColor from "../../utils/getFactionColor"

interface CardDisplayProps {
  card: CardData
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  return (
    <>
      <div
        style={{
          border: `1px solid ${getFactionColor(card.faction)}`,
        }}
        className="card-border cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] p-1 select-none"
      >
        <ManaGem
          cost={card.mana}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-12 w-12"
        />
        {/* Rarity */}
        <div className="absolute top-5 right-2">
          <Image
            alt="Icon rarity"
            src={`/icons/rarity/${card.rarity.toUpperCase()}.svg`}
            height={30}
            width={30}
          />
        </div>
        <div
          className="flex-1 pixelated"
          style={{
            backgroundImage: `url(${constants.imageUrl}/${card.resource.idle})`,
            backgroundPosition: `${
              ["MINION", "GENERAL"].includes(card.cardType.toUpperCase())
                ? "center 10%"
                : "center"
            }`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${
              ["MINION", "GENERAL"].includes(card.cardType.toUpperCase())
                ? "75%"
                : "50%"
            }`,
          }}
        ></div>
        <span className="tracking-wide"> {card.name.toUpperCase()}</span>
        <span className="tracking-wide mb-3 text-primary-cyan text-sm">
          {card.cardType.toUpperCase()}
          {card.rarity.toUpperCase() === "TOKEN" && ",TOKEN"}
        </span>
        {card.tribes.length > 0 && (
          <span className="text-primary-cyan text-sm tracking-widest">
            {card.tribes.join(",").toUpperCase()}
          </span>
        )}
        <CardDescription description={card.description} />
        {card.attack || card.health ? (
          <>
            <CardAttack
              attack={card.attack ?? 0}
              className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 h-10 w-10"
            />
            <CardHealth
              health={card.health ?? 0}
              className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-10 w-10"
            />
          </>
        ) : null}
      </div>
    </>
  )
}

export default CardDisplay
