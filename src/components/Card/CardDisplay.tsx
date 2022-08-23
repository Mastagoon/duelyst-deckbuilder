import { CardData, Faction } from "../../data/cards"
import CardAttack from "./CardAttack"
import CardHealth from "./CardHealth"
import ManaGem from "./ManaGem"
import Image from "next/image"
import CardDescription from "./CardDescription"
import constants from "../../data/constants"
import getFactionColor from "../../utils/getFactionColor"
import Link from "next/link"

interface CardDisplayProps {
  card: CardData
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  return (
    <>
      <Link href={`/card/${card.id}`}>
        <div
          style={{
            border: `1px solid ${getFactionColor(card.faction)}`,
            backgroundImage: `url(/card/${
              card.cardType.toUpperCase() === "SPELL"
                ? "spell"
                : card.cardType.toUpperCase() === "ARTIFACT"
                ? "item"
                : "troop"
            }.png)`,
          }}
          className="w-52 pb-2 card-border cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue min-h-[330px] min-w-[250px] p-1 select-none bg-no-repeat bg-cover"
        >
          <ManaGem
            cost={card.mana}
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-12 w-12"
          />
          {/* Rarity */}
          <div className="absolute top-5 right-2 flex flex-col gap-2">
            <div className="">
              <Image
                className="overflow-hidden"
                alt="Faction"
                src={`/icons/factions/${Faction[card.faction]} rune.png`}
                height={30}
                width={30}
              />
            </div>
          </div>
          <div
            className="flex-1 pixelated"
            style={{
              backgroundImage: `url(${constants.imageUrl}/${card.resource.idle})`,
              backgroundPosition: `${
                ["MINION", "GENERAL"].includes(card.cardType.toUpperCase())
                  ? "center "
                  : "center "
              }`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${
                ["MINION", "GENERAL"].includes(card.cardType.toUpperCase())
                  ? "75%"
                  : "50%"
              }`,
            }}
          ></div>
          <div className="flex-1 flex flex-col justify-start">
            <div className="flex flex-col flex-1">
              <span className="tracking-wide text-sm font-bold">
                {card.name.toUpperCase()}
              </span>
              {card.tribes.length ? (
                <span className="text-primary-cyan text-sm tracking-widest">
                  {card.tribes.join(",").toUpperCase()}
                </span>
              ) : (
                <span className="tracking-wide mb-3 text-primary-cyan text-sm">
                  {card.cardType.toUpperCase()}
                  {card.rarity.toUpperCase() === "TOKEN" && ",TOKEN"}
                </span>
              )}
            </div>
            <span className="text-xl absolute left-[3.35rem] bottom-[7.2rem]">
              {card.attack}
            </span>
            <span className="text-xl absolute right-[3.57rem] bottom-[7.2rem] translate-x-1/2">
              {card.health}
            </span>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
              <Image
                alt="Icon rarity"
                src={`/icons/rarity/${card.rarity.toUpperCase()}.svg`}
                height={30}
                width={30}
              />
            </div>

            {!!card.description && (
              <div className="flex-1">
                {" "}
                <CardDescription description={card.description} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  )
}

export default CardDisplay
