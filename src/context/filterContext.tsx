import React, { useContext, useDeferredValue, useEffect } from "react"
import { useState } from "react"
import { allCards, CardData, Faction, queryFromCards } from "../data/cards"

export interface FilterContexttype {
  cards: CardData[]
  setInitialCards: (cards: CardData[]) => void
  filteredCards: CardData[]
  filterText: string
  updateFilterText: (text: string) => void
  filterFactions?: Faction[]
  updateFilterFaction: (factions?: Faction[]) => void
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
  const [cards, setCards] = useState<CardData[]>(allCards)
  const [filteredCards, setFilteredCards] = useState<CardData[]>(allCards)
  const [filterText, setFilterText] = useState<string>("")
  const [filterFactions, setFilterFactions] = useState<Faction[]>()

  const deferredFilterText = useDeferredValue(filterText)

  useEffect(() => {
    setFilteredCards(queryFromCards(cards, deferredFilterText, filterFactions))
  }, [deferredFilterText])

  const setInitialCards = (c: CardData[]) => {
    setCards(c)
  }

  const updateFilterText = (text: string) => {
    setFilterText(text)
  }

  const updateFilterFaction = (f?: Faction[]) => {
    setFilterFactions(f)
    setFilteredCards(queryFromCards(cards, filterText, f))
  }

  useEffect(() => {
    setCards(cards)
  }, [])

  return (
    <FilterContext.Provider
      value={{
        setInitialCards,
        cards,
        filterFactions,
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
