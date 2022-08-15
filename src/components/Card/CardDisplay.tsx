import { CardData } from "../../data/cards"
import CardAttack from "./CardAttack"
import CardHealth from "./CardHealth"
import ManaGem from "./ManaGem"
import Image from "next/image"
import CardDescription from "./CardDescription"

interface CardDisplayProps {
  card: CardData
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  return (
    <>
      <div className=" border-white border-2 hover:border-primary-light-purple cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] p-1">
        <ManaGem
          cost={card.mana}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-12 w-12"
        />
        {/* Rarity */}
        <div className="absolute top-5 right-2">
          <Image
            src={`/icons/rarity/${card.rarity.toUpperCase()}.svg`}
            height={30}
            width={30}
          />
        </div>
        <div>
          <Image
            className=""
            src={`https://alpha.duelyst2.com/${card.resource.idle}`}
            layout="intrinsic"
            height={120}
            width={120}
          />
        </div>
        <span className="tracking-wide mb-3"> {card.name.toUpperCase()}</span>
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
