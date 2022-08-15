import { CardData, Faction } from "../data/cards"
import { $enum } from "ts-enum-util"
import { FaSearch } from "react-icons/fa"
import { useFilterContext } from "../context/filterContext"
import { useEffect, useState } from "react"
let debounceTimeout: any

const FilterOptions: React.FC<{ cardPool?: CardData[] }> = ({ cardPool }) => {
  const [query, setQuery] = useState("")
  const {
    updateFilterText,
    setInitialCards,
    filterFactions,
    updateFilterFaction,
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
  }, [cardPool])

  const handleChangeFaction = (f: Faction) => {
    if (filterFactions?.includes(f))
      updateFilterFaction(filterFactions.filter((fa) => fa !== f))
    else updateFilterFaction([...(filterFactions || []), f])
  }

  return (
    <div className="border-2 border-white py-5 rounded-md my-5 px-5 flex flex-row items-center justify-between">
      <div className="flex flex-row justify-between grow">
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
      <div className="relative outline-none focus:outline-none mx-5">
        <FaSearch className="absolute left-1 top-0 translate-y-1/2 text-[rgba(255,255,255,0.3)] p-0 m-0" />
        <input
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="bg-[rgba(255,255,255,0.3)] rounded-md text-white border-white border-2 pl-5 min-h-full self-center"
        />
      </div>
    </div>
  )
}

export default FilterOptions
