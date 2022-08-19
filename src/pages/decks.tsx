import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import PageLayout from "../components/PageLayout"
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
      {data?.map((deck, i) => {
        return <div key={i}>{deck.deckName}</div>
      })}
    </PageLayout>
  )
}

export default DecksPage
