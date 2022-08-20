import DeckBuilderCardList from "../components/DeckBuilderCardList"
import NewDeckList from "../components/NewDeckList"
import PageLayout from "../components/PageLayout"

const DeckBuilder: React.FC = () => {
  return (
    <PageLayout>
      <div className="grid grid-cols-12">
        <div className="lg:col-span-9 col-span-12">
          <DeckBuilderCardList />
        </div>
        <div className="hidden lg:block lg:col-span-3">
          <NewDeckList />
        </div>
      </div>
    </PageLayout>
  )
}

export default DeckBuilder
