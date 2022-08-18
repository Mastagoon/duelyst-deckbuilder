import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import CardList from "../components/CardList"
import Loading from "../components/Loading"
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
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true))
    router.events.on("routeChangeComplete", () => setLoading(false))
  }, [router])

  return (
    <PageLayout>
      <CardList cardList={cards} />
      {loading && <Loading />}
    </PageLayout>
  )
}

export default CardsPage
