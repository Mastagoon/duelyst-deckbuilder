import { NextPage } from "next"
import CardDisplay from "../components/Card/CardDisplay"
import PageLayout from "../components/PageLayout"
import { cardData } from "../data/cards"

const CardsPage: NextPage = () => {
  return (
    <>
      <PageLayout>
        <div className="grid grid-cols-12 px-10 text-white mt-10">
          <h1 className="col-span-12 text-6xl font-bold">All Cards</h1>
          <div className="col-span-12 ">Filters</div>
          <div className="col-span-12 text-center grid grid-cols-12 gap-y-5 gradient-border">
            {cardData.map((card, i) => (
              <div className="col-span-3 mx-5" key={i}>
                <CardDisplay card={card} />
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    </>
  )
}

export default CardsPage
