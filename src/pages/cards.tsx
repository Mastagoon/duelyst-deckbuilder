import { NextPage } from "next"
import CardDisplay from "../components/Card/CardDisplay"
import FilterOptions from "../components/FilterOptions"
import PageLayout from "../components/PageLayout"
import { FilterProvider, useFilterContext } from "../context/filterContext"

const CardsPage: NextPage = () => {
  const { filteredCards } = useFilterContext()

  return (
    <PageLayout>
      <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen ">
        <h1 className="col-span-12 text-4xl font-bold">All Cards</h1>
        <div className="col-span-12">
          <FilterOptions />
        </div>
        <div className="col-span-12 text-center grid grid-cols-12 gap-y-5 gradient-border overflow-y-scroll h-full">
          {filteredCards.map((card, i) => (
            <div className="col-span-3 mx-5" key={i}>
              <CardDisplay card={card} />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default CardsPage
