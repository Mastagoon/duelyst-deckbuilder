import Link from "next/link"
import Image from "next/image"
import { DeckCardEntry } from "../../context/newDeckContext"
import { FaFire, FaKhanda, FaPaw } from "react-icons/fa"
import DeckCard from "./DeckCard"
import { GiLunarWand } from "react-icons/gi"

const DeckCardInfo: React.FC<{
  generalId: number
  generalName: string
  minions: DeckCardEntry[]
  spells: DeckCardEntry[]
  artifacts: DeckCardEntry[]
  minionCount: number
  spellCount: number
  artifactCount: number
}> = ({
  generalName,
  generalId,
  spells,
  minions,
  artifacts,
  minionCount,
  spellCount,
  artifactCount,
}) => {
  return (
    <div className="col-span-12 text-center flex flex-wrap justify-around px-10 gap-y-5 overflow-y-scroll h-full py-3 grid-rows-[max-content] gap-5 flex-1">
      <div className="flex flex-col flex-1">
        <div className="flex flex-row items-center justify-center gap-1 text-faint">
          <FaKhanda />
          <span className="font-bold">General</span>
        </div>
        <div className="h-14 mb-1">
          <Link href={`/card/${generalId}`}>
            <div
              className="flex flex-row justify-start items-center px-1 py-2 my-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative
"
            >
              <Image
                src={"/card/deck_builder_card_general_bg.png"}
                className="z-0"
                layout="fill"
              />
              <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-8">
                {generalName}
              </span>
              <div
                className="absolute right-0 h-20 w-28 top-1"
                style={{
                  backgroundSize: "auto auto",
                  backgroundRepeat: "no-repeat",
                  backgroundImage: `url(/card_sprites/${generalId}.png)`,
                  opacity: 0.5,
                }}
              ></div>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex flex-row items-center justify-center text-faint gap-1 mb-1">
          <FaPaw />
          <span className="font-bold">
            Minions <span className="text-primary-cyan">({minionCount})</span>
          </span>
        </div>
        {minions.map((c, i) => (
          <Link href={`/card/${c.id}`} key={i}>
            <div>
              <DeckCard c={c} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex flex-row items-center justify-center text-center text-faint gap-1 mb-1">
          <FaFire />
          <span className="font-bold">
            Spells <span className="text-primary-cyan">({spellCount})</span>
          </span>
        </div>
        {spells.map((c, i) => (
          <Link href={`/card/${c.id}`} key={i}>
            <div>
              <DeckCard c={c} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex flex-row items-center justify-center text-faint gap-1 mb-1">
          <GiLunarWand />
          <span className="font-bold">
            Artifacts{" "}
            <span className="text-primary-cyan">({artifactCount})</span>
          </span>
        </div>
        {artifacts.map((c, i) => (
          <Link href={`/card/${c.id}`} key={i}>
            <div>
              <DeckCard c={c} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DeckCardInfo
