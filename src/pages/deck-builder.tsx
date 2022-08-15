import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"

const DeckBuilder: React.FC = () => {
  return (
    <PageLayout>
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <CardList compact={true} />
        </div>
      </div>
    </PageLayout>
  )
}

export default DeckBuilder
