import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DeckBuilderCardList from "../components/DeckBuilderCardList"
import Loading from "../components/Loading"
import NewDeckList from "../components/NewDeckList"
import PageLayout from "../components/PageLayout"

const DeckBuilder: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true))
    router.events.on("routeChangeComplete", () => setLoading(false))
  }, [router])

  return (
    <PageLayout>
      {loading && <Loading />}
      <div className="grid grid-cols-12">
        <div className="lg:col-span-10 col-span-12">
          <DeckBuilderCardList />
        </div>
        <div className="hidden lg:block lg:col-span-2">
          <NewDeckList />
        </div>
      </div>
    </PageLayout>
  )
}

export default DeckBuilder
