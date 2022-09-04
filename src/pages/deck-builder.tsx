import DeckBuilderCardList from "../components/DeckBuilderCardList"
import DeckBuilderScreen from "../components/DeckBuilder"
import PageLayout from "../components/PageLayout"
import { NewDeckProvider } from "../context/newDeckContext"
import MetaData from "../components/MetaData"

const DeckBuilder: React.FC = () => {
  return (
    <NewDeckProvider>
      <MetaData title="Browse Decks" />
      <PageLayout>
        <div className="grid grid-cols-12">
          <div className="lg:col-span-9 col-span-12">
            <DeckBuilderCardList />
          </div>
          <div className="hidden lg:block lg:col-span-3">
            <DeckBuilderScreen />
          </div>
        </div>
      </PageLayout>
    </NewDeckProvider>
  )
}

export default DeckBuilder
