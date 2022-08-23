import { useEffect } from "react"
import { useFilterContext } from "../context/filterContext"
import { CardData } from "../data/cards"
import CardDisplay from "./Card/CardDisplay"
import FilterOptions from "./FilterOptions"

const CardList: React.FC<{ compact?: boolean; cardList?: CardData[] }> = ({
  compact,
  cardList,
}) => {
  const { filteredCards, setInitialCards } = useFilterContext()
  useEffect(() => {
    if (cardList?.length) setInitialCards(cardList)
  }, [])

  return (
    <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen grid-rows-[max-content]">
      <div className="col-span-12">
        <h1 className="col-span-12 text-4xl font-bold">All Cards</h1>
        <div className="col-span-12">
          <FilterOptions />
        </div>
      </div>
      <div className="col-span-12 text-center grid grid-cols-decks justify-items-center gap-y-5 gradient-border overflow-y-scroll h-full py-3 px-6">
        {filteredCards.map((card: CardData, i: number) => (
          <div className={``} key={i}>
            <CardDisplay card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardList
