import type { NextPage } from "next"
import Head from "next/head"
import Sidebar from "../components/Sidebar"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Duelyst II Deckbuilder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </>
  )
}

export default Home
