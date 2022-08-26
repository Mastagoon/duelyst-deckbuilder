import { NextPage } from "next"
import Head from "next/head"
import { useMemo } from "react"
import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"
import { nonTokens, CardData } from "../data/cards"
import orderCards from "../utils/orderCards"

const CardsPage: NextPage = ({}) => {
  const orderedCards: CardData[] = useMemo(
    () => orderCards(nonTokens),
    [nonTokens]
  )

  return (
    <>
      <Head>
        <title>Duelyst II Deckbuilder | Card Browser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <CardList cardList={orderedCards} />
      </PageLayout>
    </>
  )
}

export default CardsPage
