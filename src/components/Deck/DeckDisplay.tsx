import { Deck } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { FaFire, FaHandRock, FaPaw, FaStar, FaStarHalf } from "react-icons/fa"
import { GiLunarWand } from "react-icons/gi"
import { Faction } from "../../data/cards"
import getFactionColor from "../../utils/getFactionColor"

const DeckDisplay: React.FC<{ deck: Deck }> = ({ deck }) => {
  return (
    <Link href={`/deck/${deck.id}`}>
      <div
        style={{
          border: `1px solid ${getFactionColor(deck.faction)}`,
        }}
        className="w-52 card-border cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] select-none bg-no-repeat bg-cover py-2 hover:scale-110 duration-500"
      >
        <span className="text-white text-left text-lg font-bold px-2">
          {deck.deckName}
        </span>
        <div className="flex flex-row">
          <span className="text-faint text-left text-sm px-2">
            Created By{" "}
            <Link href={`/user/${deck?.creatorId}`}>
              <span className="text-primary-cyan hover:opacity-80 cursor-pointer">
                {deck?.creator.name}
              </span>
            </Link>
          </span>
        </div>
        <div
          className="border-2 rounded-full p-0 m-auto"
          style={{
            borderColor: getFactionColor(deck.faction),
          }}
        >
          <Image
            className="self-center"
            alt="general"
            src={`/icons/factions/${Faction[deck.faction]} rune.png`}
            height={65}
            width={65}
          />
        </div>
        <div className="flex flex-row justify-around w-full bg-secondary-dark-blue shadow-lg px-2 py-1">
          <span className="text-faint relative">
            <FaPaw size={30} />
            <span className="">{deck.minionCount}</span>
          </span>
          <span className="text-faint relative">
            <FaFire size={30} />
            <span className="">{deck.spellCount}</span>
          </span>
          <span className="text-faint relative">
            <GiLunarWand size={30} />
            <span className="">{deck.artifactCount}</span>
          </span>
        </div>
        <div className="flex flex-col w-full shadow-lg justify-between bg-secondary-dark-blue">
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
