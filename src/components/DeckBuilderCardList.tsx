import { useEffect } from "react"
import { useFilterContext } from "../context/filterContext"
import { CardData, generalCards } from "../data/cards"
import { DeckData } from "../data/decks"
import CardDisplay from "./Card/CardDisplay"
import FilterOptions from "./FilterOptions"

interface DeckBuilderCardListProps {
  deckData?: DeckData
  setDeckData: (deckData: DeckData) => void
}

const DeckBuilderCardList: React.FC<DeckBuilderCardListProps> = ({
  deckData,
  setDeckData,
}) => {
  const { filteredCards } = useFilterContext()

  return (
    <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen ">
      <div className="col-span-12">
        <h1 className="col-span-12 text-4xl font-bold">All Cards</h1>
        <div className="col-span-12">
          <FilterOptions />
        </div>
      </div>
      <div className="col-span-12 text-center grid grid-cols-12 gap-y-5 gradient-border overflow-y-scroll h-full py-3">
        {deckData?.general ? (
          filteredCards.map((card: CardData, i: number) => (
            <div className={`mx-5 col-span-4`} key={i}>
              <CardDisplay card={card} />
            </div>
          ))
        ) : (
					{generalCards.map((card: CardData, i: number) => (
						<div className={`mx-5 col-span-4`} key={i}>
							<CardDisplay card={card} />
						</div>
					))}
        )}
      </div>
    </div>
  )
}

export default DeckBuilderCardList
