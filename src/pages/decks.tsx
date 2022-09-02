//@ts-nocheck
import { FaSearch } from "react-icons/fa"
import Head from "next/head"
import { Deck } from "@prisma/client"
import { NextPage } from "next"
import { useDeferredValue, useEffect, useRef, useState, useMemo } from "react"
import DeckDisplay from "../components/Deck/DeckDisplay"
import Loading from "../components/Loading"
import PageLayout from "../components/PageLayout"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"

const DecksPage: NextPage = () => {
  const [sortByLatest, setSortByLatest] = useState(true)
  const [sortFaction, setSortFaction] = useState("all")
  const [query, setQuery] = useState("")
  const [featured, setFeatured] = useState(false)

  const deferredQuery = useDeferredValue(query)

  const router = useRouter()

  useMemo(() => {
    if (router.query.featured === "true") setFeatured(true)
    else setFeatured(false)
  }, [router.query])

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
  const { data: featuredDecks } = trpc.useQuery(["deckgetFeaturedDecks"])

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search decks..."
              className="w-full bg-[#f1f1f1] rounded-md py-1 pl-6 min-h-full self-center"
            />
          </div>
          <button
            onClick={() => setFeatured(!featured)}
            className="bg-vetruvian rounded-sm px-5 py-1 text-white cursor-pointer"
          >
            {featured ? "Browse" : "Featured"}
          </button>
          {/* Deck filter Toggle */}
          <div className="flex items-center justify-center">
            <label
              htmlFor="toggleB"
              className="flex items-center cursor-pointer"
            >
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
        <div className="flex flex-col px-10 text-white pt-5 h-full px-5">
          <div className="">
            <h1 className="md:text-4xl xl:text-6xl text-2xl font-bold">
              {featured ? "Featured Decks" : "Deck Browser"}
            </h1>
            <span className="text-faint">
              {featured
                ? "Featured decks are selected by veteran players from the Duelyst II Community."
                : "Browse through the latest decks from the Duelyst II community."}
            </span>
          </div>
          <div
            ref={deckPageRef}
            className="text-center grid grid-cols-decks grid-rows-decks justify-items-center overflow-y-scroll h-full py-3 "
          >
            {featured
              ? featuredDecks?.map((deck) =>
                  deck.deckName
                    .toLowerCase()
                    .includes(deferredQuery.toLowerCase()) ? (
                    <DeckDisplay key={deck.id} deck={deck} />
                  ) : null
                )
              : data?.pages.map((p: any) =>
                  p.map((deck: Deck, i: number) =>
                    deck.deckName
                      .toLowerCase()
                      .includes(deferredQuery.toLowerCase()) ? (
                      <DeckDisplay key={deck.id} deck={deck} />
                    ) : null
                  )
                )}
          </div>
        </div>
      </PageLayout>
    </>
  )
}

export default DecksPage
