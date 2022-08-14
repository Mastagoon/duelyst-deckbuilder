import { CardData } from "../../data/cards"
import CardAttack from "./CardAttack"
import CardHealth from "./CardHealth"
import ManaGem from "./ManaGem"
import Image from "next/image"
import TestImage from "../../../public/test.gif"

interface CardDisplayProps {
  card: CardData
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  return (
    <>
      <div className="border-white border-2 hover:border-primary-light-purple cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue">
        <ManaGem
          cost={card.cost}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-12 w-12"
        />
        {/* Rarity */}
        <div className="absolute top-5 right-2">
          <Image
            src={`/icons/rarity/${card.rarity}.svg`}
            height={30}
            width={30}
          />
        </div>
        <div>
          <Image
            className=""
            src={TestImage}
            layout="intrinsic"
            height={120}
            width={120}
          />
        </div>
        <span> {card.title}</span>
        <span className="text-primary-dark-text">{card.type}</span>
        <span className="text-primary-dark-text">
          Adipisicing eveniet accusamus temporibus est odit, incidunt.
          Recusandae est amet
        </span>
        <CardAttack
          attack={Math.floor(Math.random() * 5)}
          className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 h-10 w-10"
        />
        <CardHealth
          health={Math.floor(Math.random() * 5)}
          className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-10 w-10"
        />
      </div>
    </>
  )
}

export default CardDisplay
