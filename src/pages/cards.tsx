import { NextPage } from "next"
import CardList from "../components/CardList"
import MetaData from "../components/MetaData"
import PageLayout from "../components/PageLayout"
import { FilterProvider } from "../context/filterContext"

const CardsPage: NextPage = ({}) => {
  return (
    <FilterProvider>
      <MetaData title="Cards" />

      <PageLayout>
        <CardList />
      </PageLayout>
    </FilterProvider>
  )
}

export default CardsPage
