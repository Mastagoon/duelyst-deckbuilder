//@ts-nocheck
import { FaSearch } from "react-icons/fa"
import Head from "next/head"
import { Deck } from "@prisma/client"
import { NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import DeckDisplay from "../components/Deck/DeckDisplay"
import Loading from "../components/Loading"
import PageLayout from "../components/PageLayout"
import { generalCards } from "../data/cards"
import { trpc } from "../utils/trpc"

const DecksPage: NextPage = () => {
  const [sortByLatest, setSortByLatest] = useState(false)
  const [sortFaction, setSortFaction] = useState("all")
  let lastScroll: number = 0
  // for some reason my tsserver is angry with useInfiniteQuery
  // It seems the typing for trpc's implementation of this straight up does not work.
  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.useInfiniteQuery(
      [
        "deckinfiniteDecks",
        { order: sortByLatest ? "latest" : "popular", faction: sortFaction },
      ],
      {
        getNextPageParam: (lastPage: Deck[]) =>
          lastPage[lastPage.length - 1]?.id,
      }
    )

  const utils = trpc.useContext()

  const deckPageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (deckPageRef.current) {
      deckPageRef.current.addEventListener("scroll", handleScroll)
      return () =>
        deckPageRef.current?.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleScroll = (e: Event) => {
    if (deckPageRef.current && hasNextPage && !isFetchingNextPage) {
      const { scrollTop, scrollHeight, clientHeight } = deckPageRef.current
      if (
        scrollTop + 5 + clientHeight >= scrollHeight &&
        scrollTop > lastScroll
      ) {
        fetchNextPage()
      }
      lastScroll = deckPageRef.current?.scrollTop ?? 0
    }
  }

  const handleSortLatestChange = () => {
    setSortByLatest(!sortByLatest)
    utils.invalidateQueries(["deckinfiniteDecks"])
  }

  const handleSortFactionChange = (e) => {
    setSortFaction(e.target.value)
    utils.invalidateQueries(["deckinfiniteDecks"])
  }

  return (
    <>
      <Head>
        <title>Duelyst II Deckbuilder | Deck Browser</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <nav className="w-full bg-darker-blue border-b-secondary-dark-blue border-b-2 text-faint flex flex-row py-2 items-center justify-between px-20">
          <div className="relative outline-none focus:outline-none mx-5 text-faint">
            <FaSearch className="absolute left-1 top-[-1px] translate-y-1/2 text-faint" />
            <input
              placeholder="Search decks..."
              className="w-full bg-white rounded-md py-1 pl-6 min-h-full self-center"
            />
          </div>
          {/* Deck filter Toggle */}
          <div className="flex items-center justify-center">
            <label for="toggleB" className="flex items-center cursor-pointer">
              <div className="mr-3">Most Popular</div>
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggleB"
                  className="sr-only"
                  checked={sortByLatest}
                  onChange={handleSortLatestChange}
                />
                <div className="block border-secondary-dark-blue border-2 w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-faint w-6 h-6 rounded-full transition"></div>
              </div>
              <div className="ml-3">Latest Decks</div>
            </label>
          </div>
          {/* Faction filter */}
          <select
            value={sortFaction}
            onChange={handleSortFactionChange}
            className="mx-5 text-faint bg-darker-blue outline-none border-none cursor-pointer"
          >
            <option value="all">All Factions</option>
            <option value="lyonar">Lyonar</option>
            <option value="songhai">Songhai</option>
            <option value="vetruvian">Vetruvian</option>
            <option value="abyssian">Abyssian</option>
            <option value="magmar">Magmar</option>
            <option value="vanar">Vanar</option>
          </select>
        </nav>
        {(isLoading || isFetchingNextPage) && <Loading />}
        <div className="flex flex-col px-10 text-white pt-5 h-screen">
          <div className="">
            <h1 className="md:text-4xl xl:text-6xl text-2xl font-bold">
              Deck Browser
            </h1>
          </div>
          <div
            ref={deckPageRef}
            className="text-center grid grid-cols-decks grid-rows-decks justify-items-center overflow-y-scroll h-full py-3 "
          >
            {data?.pages.map((p: any) =>
              p.map((deck: Deck, i: number) => {
                const general = generalCards.find(
                  (g) => g.id === deck.generalId
                )
                if (!general) return
                return <DeckDisplay key={i} deck={deck} />
              })
            )}
          </div>
        </div>
      </PageLayout>
    </>
  )
}

export default DecksPage
