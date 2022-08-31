import { NextPage } from "next"
import Head from "next/head"
import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"
import { FilterProvider } from "../context/filterContext"

const CardsPage: NextPage = ({}) => {
  return (
    <FilterProvider>
      <Head>
        <title>Duelyst II Deckbuilder | Card Browser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <CardList />
      </PageLayout>
    </FilterProvider>
  )
}

export default CardsPage
