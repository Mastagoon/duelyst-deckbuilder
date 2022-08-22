//@ts-nocheck
import { Deck } from "@prisma/client"
import { NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import DeckDisplay from "../components/Deck/DeckDisplay"
import Loading from "../components/Loading"
import PageLayout from "../components/PageLayout"
import { generalCards } from "../data/cards"
import { trpc } from "../utils/trpc"

const DecksPage: NextPage = () => {
  let lastScroll: number = 0
  // for some reason my tsserver is angry with useInfiniteQuery
  // It seems the typing for trpc's implementation of this straight up does not work.
  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.useInfiniteQuery(["deckinfiniteDecks"], {
      getNextPageParam: (lastPage: Deck[]) => lastPage[lastPage.length - 1]?.id,
    })

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

  return (
    <PageLayout>
      {(isLoading || isFetchingNextPage) && <Loading />}
      <div className="grid grid-cols-12 px-10 text-white pt-5 h-screen grid-rows-[max-content]">
        <div className="col-span-12">
          <h1 className="col-span-12 md:text-4xl text-2xl font-bold">
            Deck Browser
          </h1>
        </div>
        <div
          ref={deckPageRef}
          className="col-span-12 text-center flex flex-wrap justify-center gap-y-5 gradient-border overflow-y-scroll h-full py-3 grid-rows-[max-content] "
        >
          {data?.pages.map((p: any) =>
            p.map((deck: Deck, i: number) => {
              const general = generalCards.find((g) => g.id === deck.generalId)
              if (!general) return
              return (
                <div className="self-center justify-self-center" key={i}>
                  <DeckDisplay deck={deck} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default DecksPage
