import { NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DeckDisplay from "../components/Deck/DeckDisplay"
import Loading from "../components/Loading"
import PageLayout from "../components/PageLayout"
import { Faction, generalCards } from "../data/cards"
import constants from "../data/constants"
import getFactionColor from "../utils/getFactionColor"
import { trpc } from "../utils/trpc"

const DecksPage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { isLoading, data } = trpc.useQuery(["deckgetAll"])

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true))
    router.events.on("routeChangeComplete", () => setLoading(false))
  }, [router])

  return (
    <PageLayout>
      {(loading || isLoading) && <Loading />}
      <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen grid-rows-[max-content]">
        <div className="col-span-12">
          <h1 className="col-span-12 md:text-4xl text-2xl font-bold">
            Deck Browser
          </h1>
        </div>
        <div className="col-span-12 text-center flex flex-wrap justify-center gap-y-5 gradient-border overflow-y-scroll h-full py-3 grid-rows-[max-content] ">
          {data?.map((deck, i) => {
            const general = generalCards.find((g) => g.id === deck.generalId)
            if (!general) return
            return <DeckDisplay key={i} deck={deck} />
          })}
        </div>
      </div>
    </PageLayout>
  )
}

export default DecksPage
