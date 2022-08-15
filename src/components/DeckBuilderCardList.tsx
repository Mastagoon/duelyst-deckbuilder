import { useNewDeckContext } from "../context/newDeckContext"
import { CardData } from "../data/cards"
import CardDisplay from "./Card/CardDisplay"

const DeckBuilderCardList: React.FC = ({}) => {
  const { addCardToDeck, allowedCards } = useNewDeckContext()

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
            <CardDisplay card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeckBuilderCardList
