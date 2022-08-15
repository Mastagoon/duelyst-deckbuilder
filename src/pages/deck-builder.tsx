import { useState } from "react"
import CardList from "../components/CardList"
import NewDeckList from "../components/NewDeckList"
import PageLayout from "../components/PageLayout"
import { CardData, Faction, generalCards } from "../data/cards"

const DeckBuilder: React.FC = () => {
  const [deckFaction, setDeckFaction] = useState<Faction>()
  const [deckCards, setDeckCards] = useState<CardData[]>([])

  return (
    <PageLayout>
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          {deckFaction ? (
            <CardList compact={true} />
          ) : (
            <CardList compact={true} cardList={generalCards} />
          )}
        </div>
        <div className="col-span-2">
          <NewDeckList />
        </div>
      </div>
    </PageLayout>
  )
}

export default DeckBuilder
