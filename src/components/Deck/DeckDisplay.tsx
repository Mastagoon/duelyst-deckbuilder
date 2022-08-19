import { Deck } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { FaStar, FaStarHalf } from "react-icons/fa"
import { Faction } from "../../data/cards"
import getFactionColor from "../../utils/getFactionColor"

const DeckDisplay: React.FC<{ deck: Deck }> = ({ deck }) => {
  return (
    <Link href={`/deck/${deck.id}`}>
      <div
        style={{
          border: `1px solid ${getFactionColor(deck.faction)}`,
        }}
        className="w-52 card-border cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] p-1 select-none bg-no-repeat bg-cover py-2"
      >
        <Image
          className=""
          alt="general"
          src={`/icons/factions/${Faction[deck.faction]} rune.png`}
          height={130}
          width={130}
        />
        <span className="text-primary-cyan text-md font-bold flex-1">
          {deck.deckName}
        </span>
        <div className="flex flex row w-full bg-primary-cyan shadow-lg">
          <span>Minions: {deck.minionCount}</span>
          <span>Spells: {deck.spellCount}</span>
          <span>Artifacts: {deck.artifactCount}</span>
        </div>
        <div className="flex flex-col w-full shadow-lg justify-between bg-secondary-dark-blue">
          <span>Reviews: 5</span>
          <div className="flex flex-row justify-center gap-1">
            {Array.from({ length: Math.ceil(Math.random() * 4) }).map(
              (_, i) => (
                <FaStar key={i} />
              )
            )}
            {Math.random() > 0.5 && <FaStarHalf />}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DeckDisplay
