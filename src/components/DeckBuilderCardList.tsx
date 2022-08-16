import { useNewDeckContext } from "../context/newDeckContext"
import Image from "next/image"
import { CardData } from "../data/cards"
import getFactionColor from "../utils/getFactionColor"
import CardDescription from "./Card/CardDescription"
import CardAttack from "./Card/CardAttack"
import CardHealth from "./Card/CardHealth"
import ManaGem from "./Card/ManaGem"
import constants from "../data/constants"

const DeckBuilderCardList: React.FC = ({}) => {
  const { addCardToDeck, cards, allowedCards } = useNewDeckContext()

  const handleCardClick = (id: number) => {
    addCardToDeck(id)
  }

  return (
    <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen ">
      <div className="col-span-12">
        <h1 className="col-span-12 text-4xl font-bold">Deck Builder</h1>
        {/*
			#TODO fix filters in deck builder
				<div className="col-span-12">
				<FilterOptions cardPool={allowedCards} />
			</div>
				*/}
      </div>
      <div className="col-span-12 text-center grid grid-cols-12 gap-y-5 gradient-border overflow-y-scroll h-full py-3">
        {allowedCards.map((card: CardData, i: number) => (
          <div
            onClick={() => handleCardClick(card.id)}
            className={`mx-5 col-span-4`}
            key={i}
          >
            <div
              style={{
                border: `1px solid ${getFactionColor(card.faction)}`,
                opacity:
                  cards.find((c) => c.id === card.id)?.count === 3 ? 0.5 : 1,
              }}
              className="card-border cursor-pointer transition-all duration-100 m-5 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] p-1 active:scale-110"
            >
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
              {cards.find((c) => c.id === card.id)?.count > 0 ? (
                <div className="z-2 bg-primary-cyan rounded-sm w-full">
                  Copies in deck:{" "}
                  <span>{cards.find((c) => c.id === card.id)?.count ?? 0}</span>
                </div>
              ) : null}
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeckBuilderCardList
