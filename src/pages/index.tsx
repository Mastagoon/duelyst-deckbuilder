import type { NextPage } from "next"
import MetaData from "../components/MetaData"
import Sidebar from "../components/Sidebar"

const Home: NextPage = () => {
  return (
    <>
      <MetaData />
      <Sidebar />
    </>
  )
}

export default Home
