import { useFilterContext } from "../context/filterContext"
import {
  abyssianCards,
  Faction,
  generalCards,
  lyonarCards,
  magmarCards,
  neutralCards,
  songhaiCards,
  vanarCards,
  vetruvianCards,
} from "../data/cards"
import CardDisplay from "./Card/CardDisplay"
import FilterOptions from "./FilterOptions"

const CardList: React.FC = () => {
  const { filteredCards } = useFilterContext()

  return (
    <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen grid-rows-[max-content]">
      <div className="col-span-12">
        <h1 className="col-span-12 text-4xl font-bold text-faint">All Cards</h1>
        <div className="mr-2 inline h-12 w-12 text-lg text-faint font-bold">
          -
        </div>
        <span className="text-faint">
          Viewing{" "}
          <span className="text-white">{filteredCards.length} Cards</span>
        </span>
        <div className="col-span-12">
          <FilterOptions />
        </div>
      </div>
      <div className="col-span-12 text-center grid grid-cols-decks justify-items-center gap-y-5 overflow-y-scroll h-full py-3 px-6">
        {generalCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {lyonarCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {songhaiCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {vetruvianCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {abyssianCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {magmarCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {vanarCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
        {neutralCards.map((c, i) => (
          <div
            className={`${filteredCards.includes(c.id) ? "" : "hidden"}`}
            key={i}
          >
            <CardDisplay card={c} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardList
