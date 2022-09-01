import { useDeckContext } from "../context/newDeckContext"
import Swal from "sweetalert2"
import { CardData, Faction, generalCards } from "../data/cards"
import { FaLayerGroup, FaSearch } from "react-icons/fa"
import { useMemo, useState } from "react"
import DeckBuilderScreen from "./DeckBuilder"
import { useRouter } from "next/router"
import DeckBuilderCardDisplay from "./Deck/DeckBuilderCardDisplay"

let debounceTimeout: any

const DeckBuilderCardList: React.FC = ({}) => {
  const router = useRouter()

  const deckCode = useMemo(() => router.query.deck, [router.query]) as string

  const [query, setQuery] = useState("")
  const [showOnlyFactionCards, setShowOnlyFactionCards] = useState(false)
  const [showOnlyNeutralCards, setShowOnlyNeutralCards] = useState(false)
  const [searchMobileMenuActive, setSearchMobileMenuActive] = useState(false)
  const [decklistMobileMenuActive, setDecklistMobileMenuActive] =
    useState(false)
  const {
    loadFromDeckCode,
    addCardToDeck,
    minionCount,
    spellCount,
    artifactCount,
    general,
    updateFilterText,
    factionCards,
    neutralCards,
  } = useDeckContext()

  if (deckCode) loadFromDeckCode(deckCode)

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

  const handleToggleOnlyFactionCards = () => {
    setShowOnlyNeutralCards(false)
    setShowOnlyFactionCards(!showOnlyFactionCards)
  }
  const handleToggleOnlyNeutralCards = () => {
    setShowOnlyFactionCards(false)
    setShowOnlyNeutralCards(!showOnlyNeutralCards)
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
            <DeckBuilderScreen />
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
          {general ? (
            <div className="flex flex-col shadow-lg border-2 border-secondary-dark-blue py-2 rounded-md mt-1 px-5 flex flex-row flex-wrap items-center justify-center text-faint gap-3">
              <div className="col-span-12 flex flex-row w-full justify-center gap-6 text-faint">
                <h1
                  onClick={handleToggleOnlyFactionCards}
                  className={`capitalize text-4xl font-bold hover:text-white cursor-pointer ${
                    !showOnlyFactionCards ? "text-secondary-cyan" : "text-white"
                  }`}
                >
                  {Faction[general.faction]}
                </h1>
                <h1
                  onClick={handleToggleOnlyNeutralCards}
                  className={`capitalize text-4xl font-bold hover:text-white cursor-pointer ${
                    !showOnlyNeutralCards ? "text-secondary-cyan" : "text-white"
                  }`}
                >
                  Neutral
                </h1>
              </div>

              <div className="relative outline-none focus:outline-none mx-5 text-faint">
                <FaSearch className="absolute left-1 top-[-1px] translate-y-1/2 text-faint" />
                <input
                  value={query}
                  onChange={handleQueryStringChange}
                  placeholder="Search..."
                  className="w-full bg-white rounded-md py-1 pl-6 min-h-full self-center"
                />
              </div>
            </div>
          ) : (
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
          )}
        </div>
        <div className="col-span-12 text-center grid grid-cols-decks justify-items-center gap-y-5 overflow-y-scroll h-full py-3 select-none">
          {general ? (
            <>
              {showOnlyFactionCards
                ? factionCards.map((card: CardData, i: number) => (
                    <div key={i}>
                      <DeckBuilderCardDisplay
                        handleCardClick={handleCardClick}
                        card={card}
                      />
                    </div>
                  ))
                : showOnlyNeutralCards
                ? neutralCards.map((card: CardData, i: number) => (
                    <div key={i}>
                      <DeckBuilderCardDisplay
                        handleCardClick={handleCardClick}
                        card={card}
                      />
                    </div>
                  ))
                : [...factionCards, ...neutralCards].map(
                    (card: CardData, i: number) => (
                      <div key={i}>
                        <DeckBuilderCardDisplay
                          handleCardClick={handleCardClick}
                          card={card}
                        />
                      </div>
                    )
                  )}
            </>
          ) : (
            generalCards.map((card: CardData, i: number) => (
              <div key={i}>
                <DeckBuilderCardDisplay
                  handleCardClick={handleCardClick}
                  card={card}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default DeckBuilderCardList
