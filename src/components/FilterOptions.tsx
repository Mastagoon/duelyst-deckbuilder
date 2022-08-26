import { CardData, Faction } from "../data/cards"
import Image from "next/image"
import { GoSettings } from "react-icons/go"
import { $enum } from "ts-enum-util"
import { FaSearch } from "react-icons/fa"
import { useFilterContext } from "../context/filterContext"
import { useEffect, useState } from "react"
import ManaGem from "./Card/ManaGem"
let debounceTimeout: any

const FilterOptions: React.FC<{ cardPool?: CardData[] }> = ({ cardPool }) => {
  const [query, setQuery] = useState("")
  const [extendedFilters, setExtendedFilters] = useState(false)
  const {
    updateFilterText,
    setInitialCards,
    filterFactions,
    updateFilterFaction,
    filterManaCost,
    updateFilterManaCost,
    cardTypeFilter,
    clearFilters,
    updateCardTypeFilter,
    filterCardRarity,
    updateFilterCardRarity,
  } = useFilterContext()

  const handleChange = (e: any) => {
    // #TODO why am I debouncing this manually?
    clearTimeout(debounceTimeout)
    setQuery(e.target.value)
    debounceTimeout = setTimeout(() => {
      updateFilterText(e.target.value)
    }, 300)
    // updateFilterText(deferredQuery)
  }

  useEffect(() => {
    if (cardPool?.length) setInitialCards(cardPool)
  }, [cardPool, setInitialCards])

  const handleChangeFaction = (f: Faction) => {
    if (filterFactions?.includes(f))
      updateFilterFaction(filterFactions.filter((fa) => fa !== f))
    else updateFilterFaction([...(filterFactions || []), f])
  }

  if (extendedFilters)
    return (
      <div className="flex flex-col shadow-lg border-2 border-secondary-dark-blue py-5 rounded-md my-5 px-5 flex flex-row flex-wrap items-center justify-center text-faint">
        <div className="w-full flex flex-row flex-wrap items-center justify-center">
          <div className="flex flex-row flex-wrap justify-between grow">
            {$enum(Faction)
              .getKeys()
              .map((faction, i) => {
                // #TODO fix me
                return (
                  <span
                    onClick={() => handleChangeFaction(Faction[faction])}
                    key={i}
                    className={`text-white capitalize cursor-pointer rounded-md px-2 py-1 ${
                      filterFactions?.includes(Faction[faction])
                        ? "bg-primary-dark text-fading-white"
                        : ""
                    }`}
                  >
                    {faction}
                  </span>
                )
              })}
          </div>
          <div className="relative outline-none focus:outline-none mx-5 text-faint">
            <FaSearch className="absolute left-1 top-[-1px] translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={handleChange}
              placeholder="Search..."
              className="w-full bg-white rounded-md py-1 pl-6 min-h-full self-center"
            />
          </div>
          <div
            onClick={() => setExtendedFilters(!extendedFilters)}
            className="p-1 rounded-sm border-[1px] border-faint text-faint cursor-pointer transition-all hover:scale-110 hover:rotate-90"
          >
            <GoSettings
              style={{
                transform: extendedFilters ? "rotate(90deg)" : "",
              }}
              size={25}
            />
          </div>
        </div>
        <hr className="w-full my-2 border-secondary-dark-blue" />
        <div className="flex flex-row flex-wrap w-full justify-between animate-slideInFromTop mt-2 px-5">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row items-center">
              <div className="uppercase">Mana Cost</div>
              <div className="flex flex-row gap-1 w-full">
                {Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).map((num, i) => (
                  <div
                    key={i}
                    style={{
                      opacity: filterManaCost.includes(num) ? 1 : 0.3,
                    }}
                    onClick={() => updateFilterManaCost(num)}
                  >
                    <ManaGem
                      className="h-14 w-14 hover:opacity-90 transition-all"
                      cost={num}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row flex-1 justify-end items-center gap-3">
              <div className="uppercase">Card Type</div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <button
                    style={{
                      opacity: cardTypeFilter.includes("GENERAL") ? 1 : 0.5,
                    }}
                    onClick={() => updateCardTypeFilter("GENERAL")}
                    className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer transition-all hover:scale-105"
                  >
                    General
                  </button>
                  <button
                    style={{
                      opacity: cardTypeFilter.includes("SPELL") ? 1 : 0.5,
                    }}
                    onClick={() => updateCardTypeFilter("SPELL")}
                    className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer transition-all hover:scale-105"
                  >
                    Spell
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    style={{
                      opacity: cardTypeFilter.includes("MINION") ? 1 : 0.5,
                    }}
                    onClick={() => updateCardTypeFilter("MINION")}
                    className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer transition-all hover:scale-105"
                  >
                    Minion
                  </button>
                  <button
                    style={{
                      opacity: cardTypeFilter.includes("ARTIFACT") ? 1 : 0.5,
                    }}
                    className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer transition-all hover:scale-105"
                    onClick={() => updateCardTypeFilter("ARTIFACT")}
                  >
                    Artifact
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row w-full items-center gap-5">
              <div className="uppercase">Rarity</div>
              <div
                onClick={() => updateFilterCardRarity("basic")}
                className={`flex flex-col items-center ${
                  filterCardRarity.includes("basic")
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  alt="RARITY"
                  src={`/icons/rarity/collection_card_rarity_basic.png`}
                  width={60}
                  height={60}
                />
                <span className="text-md">Basic</span>
              </div>
              <div
                onClick={() => updateFilterCardRarity("common")}
                className={`flex flex-col items-center ${
                  filterCardRarity.includes("common")
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  alt="RARITY"
                  src={`/icons/rarity/collection_card_rarity_common.png`}
                  width={60}
                  height={60}
                />
                <span className="text-md">Common</span>
              </div>
              <div
                onClick={() => updateFilterCardRarity("rare")}
                className={`flex flex-col items-center ${
                  filterCardRarity.includes("rare")
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  alt="RARITY"
                  src={`/icons/rarity/collection_card_rarity_rare.png`}
                  width={60}
                  height={60}
                />
                <span className="text-md">Rare</span>
              </div>
              <div
                onClick={() => updateFilterCardRarity("epic")}
                className={`flex flex-col items-center ${
                  filterCardRarity.includes("epic")
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  alt="RARITY"
                  src={`/icons/rarity/collection_card_rarity_epic.png`}
                  width={60}
                  height={60}
                />
                <span className="text-md">Epic</span>
              </div>
              <div
                onClick={() => updateFilterCardRarity("legendary")}
                className={`flex flex-col items-center ${
                  filterCardRarity.includes("legendary")
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              >
                <Image
                  alt="RARITY"
                  src={`/icons/rarity/collection_card_rarity_legendary.png`}
                  width={60}
                  height={60}
                />
                <span className="text-md">Legendary</span>
              </div>
            </div>
            <div className="w-full flex flex-row justify-end">
              <button
                onClick={clearFilters}
                className="text-lg text-amber-300 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="shadow-lg border-2 border-secondary-dark-blue py-5 rounded-md my-5 px-5 flex flex-row flex-wrap items-center justify-center text-faint">
      <div className="flex flex-row flex-wrap justify-between grow">
        {$enum(Faction)
          .getKeys()
          .map((faction, i) => {
            // #TODO fix me
            return (
              <span
                onClick={() => handleChangeFaction(Faction[faction])}
                key={i}
                className={`text-white capitalize cursor-pointer rounded-md px-2 py-1 ${
                  filterFactions?.includes(Faction[faction])
                    ? "bg-primary-dark text-fading-white"
                    : ""
                }`}
              >
                {faction}
              </span>
            )
          })}
      </div>
      <div className="relative outline-none focus:outline-none mx-5 text-faint">
        <FaSearch className="absolute left-1 top-[-1px] translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="w-full bg-white rounded-md py-1 pl-6 min-h-full self-center"
        />
      </div>
      <div
        onClick={() => setExtendedFilters(!extendedFilters)}
        className="p-1 rounded-sm border-[1px] border-faint text-faint cursor-pointer transition-all hover:scale-110 hover:rotate-90"
      >
        <GoSettings
          style={{
            transform: extendedFilters ? "rotate(90deg)" : "",
          }}
          size={25}
        />
      </div>
    </div>
  )
}

export default FilterOptions
