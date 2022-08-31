import Head from "next/head"
import DeckBuilderCardList from "../components/DeckBuilderCardList"
import DeckBuilderScreen from "../components/DeckBuilder"
import PageLayout from "../components/PageLayout"
import { NewDeckProvider } from "../context/newDeckContext"

const DeckBuilder: React.FC = () => {
  return (
    <NewDeckProvider>
      <Head>
        <title>Duelyst II Deckbuilder </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <div className="grid grid-cols-12">
          <div className="lg:col-span-9 col-span-12">
            <DeckBuilderCardList />
          </div>
          <div className="hidden lg:block lg:col-span-3">
            <DeckBuilderScreen />
          </div>
        </div>
      </PageLayout>
    </NewDeckProvider>
  )
}

export default DeckBuilder
