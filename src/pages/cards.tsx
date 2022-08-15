import { NextPage } from "next"
import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"

const CardsPage: NextPage = () => {
  return (
    <PageLayout>
      <CardList />
    </PageLayout>
  )
}

export default CardsPage
