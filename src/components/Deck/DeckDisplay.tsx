import { Deck } from "@prisma/client"
import Image from "next/image"
import { Faction } from "../../data/cards"
import getFactionColor from "../../utils/getFactionColor"

const DeckDisplay: React.FC<{ deck: Deck }> = ({ deck }) => {
  return (
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
    </div>
  )
}

export default DeckDisplay
