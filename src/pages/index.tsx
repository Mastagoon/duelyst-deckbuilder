import type { NextPage } from "next"
import Head from "next/head"
import Sidebar from "../components/Sidebar"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Duelyst Deckbuilder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <h1>Hello World</h1>
    </>
  )
}

export default Home
