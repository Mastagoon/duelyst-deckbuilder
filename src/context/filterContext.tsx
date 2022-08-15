import React, { useContext, useDeferredValue, useEffect } from "react"
import { useState } from "react"
import { allCards, CardData, Faction, queryFromCards } from "../data/cards"

export interface FilterContexttype {
  cards: CardData[]
  filteredCards: CardData[]
  filterText: string
  updateFilterText: (text: string) => void
  filterFaction?: Faction
  updateFilterFaction: (faction?: Faction) => void
}

const FilterContext = React.createContext<FilterContexttype | null>(null)

interface FilterProviderProps {
  children: React.ReactNode
}

export const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (context === null) {
    throw new Error("useFilterContext must be used within a FilterProvider")
  }
  return context
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<CardData[]>([])
  const [filteredCards, setFilteredCards] = useState<CardData[]>(allCards)
  const [filterText, setFilterText] = useState<string>("")
  const [filterFaction, setFilterFaction] = useState<Faction>()

  const deferredFilterText = useDeferredValue(filterText)

  useEffect(() => {
    setFilteredCards(
      queryFromCards(allCards, deferredFilterText, filterFaction)
    )
  }, [deferredFilterText])

  // const updateFilterFaction = (f?: Faction) => {
  // if(!f)
  //
  // }

  const updateFilterText = (text: string) => {
    setFilterText(text)
  }

  const updateFilterFaction = (f?: Faction) => {
    setFilterFaction(f)
    setFilteredCards(queryFromCards(allCards, filterText, f))
  }

  useEffect(() => {
    setCards(allCards)
  }, [])

  return (
    <FilterContext.Provider
      value={{
        cards,
        filterFaction,
        updateFilterFaction,
        filterText,
        updateFilterText,
        filteredCards,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
