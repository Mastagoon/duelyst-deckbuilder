import type { NextPage } from "next"
import Head from "next/head"
import Loading from "../components/Loading"
import Sidebar from "../components/Sidebar"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Duelyst Deckbuilder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </>
  )
}

export default Home
