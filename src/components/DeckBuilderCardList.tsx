import { useDeckContext } from "../context/newDeckContext"
import Swal from "sweetalert2"
import Image from "next/image"
import { CardData, Faction } from "../data/cards"
import getFactionColor from "../utils/getFactionColor"
import CardDescription from "./Card/CardDescription"
import ManaGem from "./Card/ManaGem"
import constants from "../data/constants"
import { FaLayerGroup, FaSearch } from "react-icons/fa"
import { useState } from "react"
import NewDeckList from "./NewDeckList"

let debounceTimeout: any

const DeckBuilderCardList: React.FC = ({}) => {
  const [query, setQuery] = useState("")
  const [searchMobileMenuActive, setSearchMobileMenuActive] = useState(false)
  const [decklistMobileMenuActive, setDecklistMobileMenuActive] =
    useState(false)
  const {
    addCardToDeck,
    minionCount,
    spellCount,
    artifactCount,
    general,
    cards,
    filteredCards,
    updateFilterText,
  } = useDeckContext()

  const handleQueryStringChange = (e: any) => {
    clearTimeout(debounceTimeout)
    setQuery(e.target.value)
    debounceTimeout = setTimeout(() => {
      updateFilterText(e.target.value)
    }, 300)
  }

  const handleCardClick = (id: number) => {
    if (minionCount + spellCount + artifactCount === 39)
      Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        text: "You've reached the maximum number of cards in your deck.",
        timer: 2000,
        position: "bottom-right",
        showConfirmButton: false,
      })
    addCardToDeck(id)
  }

  const toggleSearchMenu = () => {
    setSearchMobileMenuActive(!searchMobileMenuActive)
  }

  const toggleDeckMenu = () => {
    setDecklistMobileMenuActive(!decklistMobileMenuActive)
  }

  return (
    <>
      {/* mobile menu */}
      <div className="fixed bottom-0 w-full bg-secondary-dark-blue flex flex-col justify-around py-3 z-50 lg:hidden">
        <div className="flex flex-row w-full justify-around">
          <FaSearch
            className="text-secondary-cyan hover:opacity-80 transition-all"
            onClick={toggleSearchMenu}
            size={32}
          />
          <FaLayerGroup
            className="text-secondary-cyan hover:opacity-80 transition-all"
            onClick={toggleDeckMenu}
            size={32}
          />
        </div>
        {searchMobileMenuActive && (
          <div className="relative outline-none focus:outline-none mx-5 self-center animate-slideInFromBottom">
            <FaSearch className="absolute left-1 top-0 translate-y-1/2 text-[rgba(255,255,255,0.3)] p-0 m-0" />
            <input
              value={query}
              onChange={handleQueryStringChange}
              placeholder="Search..."
              className="bg-[rgba(255,255,255,0.3)] rounded-md text-white border-white border-2 pl-5 min-h-full self-center"
            />
          </div>
        )}
        {decklistMobileMenuActive && (
          <div
            className={
              "h-[50vh] w-full max-w-md overflow-y-scroll mt-1 relative outline-none focus:outline-none self-center animate-slideInFromBottom"
            }
          >
            <NewDeckList />
          </div>
        )}
      </div>
      <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen grid-rows-[max-content]">
        <div className="col-span-12">
          {general ? (
            <h1 className="col-span-12 md:text-4xl text-2xl font-bold">
              Deck Builder
            </h1>
          ) : (
            <h1 className="col-span-12 md:text-4xl text-2xl font-bold capitalize">
              Choose your general
            </h1>
          )}
          <div className="col-span-12">
            <div className="flex flex-row justify-center hidden lg:block">
              <div className="text-center outline-none focus:outline-none mx-5 my-2">
                <input
                  value={query}
                  onChange={handleQueryStringChange}
                  placeholder="Search..."
                  className="bg-[rgba(255,255,255,0.3)] rounded-md text-white border-white border-2 pl-5 min-h-full self-center w-1/3"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 text-center grid grid-cols-decks justify-items-center gap-y-5 gradient-border overflow-y-scroll h-full py-3 select-none">
          {filteredCards.map((card: CardData, i: number) => (
            <div key={i}>
              <div
                onClick={() => handleCardClick(card.id)}
                style={{
                  opacity:
                    cards.find((c) => c.id === card.id)?.count >= 3 ? 0.3 : 1,
                  backgroundImage: `url(/card/${
                    card.cardType.toUpperCase() === "SPELL"
                      ? "spell"
                      : card.cardType.toUpperCase() === "ARTIFACT"
                      ? "item"
                      : "troop"
                  }.png)`,
                }}
                className="pb-2 card-border cursor-pointer transition-all duration-100 m-5 relative flex flex-col rounded-md min-h-[330px] min-w-[250px] p-1 select-none bg-no-repeat bg-cover active:scale-110"
              >
                {card.cardType.toUpperCase() !== "GENERAL" && (
                  <ManaGem
                    cost={card.mana}
                    className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-12 w-12"
                  />
                )}
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
                {/* Rarity */}
                <div
                  className={`flex-1 pixelated ${
                    card.cardType.toUpperCase() === "SPELL" ||
                    card.cardType.toUpperCase() === "ARTIFACT"
                      ? ""
                      : ""
                  }`}
                  style={{
                    backgroundImage: `url(${constants.imageUrl}/${card.resource.idle})`,
                    backgroundPosition: `${
                      ["MINION", "GENERAL"].includes(
                        card.cardType.toUpperCase()
                      )
                        ? "center "
                        : "center 100%"
                    }`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${
                      ["MINION", "GENERAL"].includes(
                        card.cardType.toUpperCase()
                      )
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
                </div>
                {/*@ts-ignore*/}
                {cards.find((c) => c.id === card.id)?.count > 0 ? (
                  <div className="z-2 bg-primary-cyan rounded-sm w-full">
                    Copies in deck:{" "}
                    <span>
                      {cards.find((c) => c.id === card.id)?.count ?? 0}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default DeckBuilderCardList
