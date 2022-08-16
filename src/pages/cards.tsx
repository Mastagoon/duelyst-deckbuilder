import { NextPage } from "next"
import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"
import { nonTokens, CardData } from "../data/cards"
import orderCards from "../utils/orderCards"

export const getStaticProps = async () => {
  const cards = nonTokens
  return {
    props: {
      cards: orderCards(cards),
    },
  }
}

const CardsPage: NextPage<{ cards: CardData[] }> = ({ cards }) => {
  return (
    <PageLayout>
      <CardList cardList={cards} />
    </PageLayout>
  )
}

export default CardsPage
