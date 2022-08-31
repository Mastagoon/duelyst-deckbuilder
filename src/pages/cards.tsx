import { NextPage } from "next"
import Head from "next/head"
import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"

const CardsPage: NextPage = ({}) => {
  return (
    <>
      <Head>
        <title>Duelyst II Deckbuilder | Card Browser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <CardList />
      </PageLayout>
    </>
  )
}

export default CardsPage
