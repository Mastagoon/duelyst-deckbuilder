import { CardData, cardDataById, Faction } from "../../data/cards"
import ManaGem from "./ManaGem"
import Image from "next/image"
import CardDescription from "./CardDescription"
import Link from "next/link"
import CardTooltip from "../CardTooltip"
import { useState } from "react"

interface CardDisplayProps {
  card: CardData
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <>
      <Link href={`/card/${card.id}`}>
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            backgroundImage: `url(/card/${
              card.cardType.toUpperCase() === "SPELL"
                ? "spell"
                : card.cardType.toUpperCase() === "ARTIFACT"
                ? "item"
                : "troop"
            }.png)`,
          }}
          className="pb-2 card-border cursor-pointer transition-all m-5 relative flex flex-col rounded-md  min-h-[330px] min-w-[250px] p-1 select-none bg-no-repeat bg-cover"
        >
          <div
            className={`flex-1 pixelated ${
              card.cardType.toUpperCase() === "SPELL" ||
              card.cardType.toUpperCase() === "ARTIFACT"
                ? ""
                : ""
            }`}
            style={{
              backgroundImage: `url(/card_sprites/${card.id}.gif)`,
              backgroundPosition: `${
                ["MINION", "GENERAL"].includes(card.cardType.toUpperCase())
                  ? "center "
                  : "center 100%"
              }`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${
                ["MINION", "GENERAL"].includes(card.cardType.toUpperCase())
                  ? "75%"
                  : "40%"
              }`,
            }}
          ></div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col mt-2 -1">
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
            {!!card.description && (
              <div className=" bottom-12 left-1/2 w-full -translate-x-1/2 absolute leading-3 px-4">
                <CardDescription description={card.description} />
              </div>
            )}
            {/* Absolute */}
            <span className="text-xl absolute left-[3.35rem] bottom-[7.2rem]">
              {card.attack}
            </span>
            <span className="text-xl absolute right-[3.57rem] bottom-[7.2rem] translate-x-1/2">
              {card.health}
            </span>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2"></div>
            {card.cardType.toUpperCase() !== "GENERAL" && (
              <ManaGem
                cost={card.mana}
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-14 w-14"
              />
            )}
            {/* Rarity */}
            {card.cardType.toUpperCase() !== "GENERAL" &&
              card.rarity.toUpperCase() !== "TOKEN" && (
                <div className="absolute bottom-24 right-1/2 translate-x-1/2">
                  <Image
                    className="overflow-hidden"
                    alt="Rarity"
                    src={`/icons/rarity/collection_card_rarity_${card.rarity.toLowerCase()}.png`}
                    height={44}
                    width={44}
                  />
                </div>
              )}
            {/* Faction */}
            <div className="absolute top-[1.1em] right-[1em] flex flex-col gap-2">
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
          </div>
          {card.relatedCards.map((r, i) =>
            cardDataById[r] ? (
              <CardTooltip
                key={i}
                c={cardDataById[r]!}
                show={showTooltip}
                nested={true}
              />
            ) : null
          )}
        </div>
      </Link>
    </>
  )
}

export default CardDisplay
