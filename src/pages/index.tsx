import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import Sidebar from "../components/Sidebar"

const Home: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true))
    router.events.on("routeChangeComplete", () => setLoading(false))
  }, [router])

  return (
    <>
      <Head>
        <title>Duelyst Deckbuilder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      {loading && <Loading />}
    </>
  )
}

export default Home
