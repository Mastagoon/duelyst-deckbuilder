import Image from "next/image"
import { Faction, neutralCards } from "../../data/cards"
import getFactionColors from "../../utils/getFactionColor"

const DeckCardRatio: React.FC<{
  faction: number
  factionCards: number
  neutralCards: number
}> = ({ faction, factionCards, neutralCards }) => {
  return (
    <div className="flex flex-col self-start">
      <div className="flex flex-row items-center gap-3">
        <div className="flex-1 border-faint border-t-[1px]"></div>
        <span className="">Card Ratio</span>
        <div className="flex-1 border-faint border-t-[1px]"></div>
      </div>
      <div className="flex flex-col capitalize">
        <div className="flex flex-row items-center gap-2">
          <Image
            height={30}
            width={30}
            src={`/icons/factions/${Faction[faction]} rune.png`}
          />
          <div className="flex flex-row items-center">
            <div
              className="h-3 w-1"
              style={{
                backgroundColor: getFactionColors(faction),
              }}
            ></div>
            {[...Array(factionCards)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: getFactionColors(faction),
                }}
                className={`h-3 w-1`}
              ></div>
            ))}
            <span className="mx-2 text-sm">{factionCards} cards</span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 justify-start">
          <Image
            height={30}
            width={30}
            src={`/icons/factions/neutral rune.png`}
          />
          <div className="flex flex-row items-center">
            <div className="h-3 w-1 bg-white"></div>
            {[...Array(neutralCards)].map((_, i) => (
              <div key={i} className="h-3 w-1 bg-white"></div>
            ))}
            <span className="mx-2 text-sm">{neutralCards} cards</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeckCardRatio
