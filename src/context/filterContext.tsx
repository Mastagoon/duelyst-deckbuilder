import React, { useContext, useDeferredValue, useMemo } from "react"
import { useState } from "react"
import { allCards, CardData, CardType, Faction, Rarity } from "../data/cards"

export interface FilterContexttype {
  cards: CardData[]
  setInitialCards: (cards: CardData[]) => void
  filteredCards: number[]
  filterText: string
  updateFilterText: (text: string) => void
  filterFactions?: Faction[]
  updateFilterFaction: (factions?: Faction[]) => void
  filterManaCost: number[]
  updateFilterManaCost: (num: number) => void
  cardTypeFilter: CardType[]
  updateCardTypeFilter: (t: CardType) => void
  clearFilters: () => void
  filterCardRarity: Rarity[]
  updateFilterCardRarity: (r: Rarity) => void
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
  const [filterText, setFilterText] = useState<string>("")
  const [filterFactions, setFilterFactions] = useState<Faction[]>()
  const [filterManaCost, setFiltereManaCost] = useState<number[]>([])
  const [cardTypeFilter, setCardTypeFilter] = useState<CardType[]>([])
  const [filterCardRarity, setFilterCardRarity] = useState<Rarity[]>([])

  const deferredFilterText = useDeferredValue(filterText)

  const filteredCards: number[] = useMemo(() => {
    if (
      !deferredFilterText &&
      !filterFactions?.length &&
      !filterManaCost.length &&
      !cardTypeFilter.length &&
      !filterCardRarity.length
    ) {
      return cards.map((c) => c.id)
    }
    return cards
      .filter((card) => {
        if (filterFactions?.length && !filterFactions.includes(card.faction))
          return false
        if (
          cardTypeFilter.length &&
          !cardTypeFilter.includes(card.cardType.toUpperCase() as CardType)
        )
          return false
        if (
          filterCardRarity.length &&
          !filterCardRarity.includes(card.rarity.toLowerCase() as Rarity)
        )
          return false
        if (filterManaCost.length && !filterManaCost.includes(card.mana))
          return false
        if (deferredFilterText)
          return (
            card.name
              .toLowerCase()
              .includes(deferredFilterText.toLowerCase()) ||
            card.description
              ?.toLowerCase()
              .includes(deferredFilterText.toLowerCase()) ||
            card.tribes.some((tribe) =>
              tribe.toLowerCase().includes(deferredFilterText.toLowerCase())
            )
          )
        return card.id
      })
      .map((c) => c.id)
  }, [
    deferredFilterText,
    filterManaCost,
    filterFactions,
    cards,
    cardTypeFilter,
    filterCardRarity,
  ])

  const updateFilterManaCost = (num: number) => {
    setFiltereManaCost(
      filterManaCost.includes(num)
        ? filterManaCost.filter((n) => n !== num)
        : [...filterManaCost, num]
    )
  }

  const setInitialCards = (c: CardData[]) => {
    setCards(c)
  }

  const updateFilterText = (text: string) => {
    setFilterText(text)
  }

  const updateFilterFaction = (f?: Faction[]) => {
    setFilterFactions(f)
  }

  const updateCardTypeFilter = (type: CardType) => {
    setCardTypeFilter(
      cardTypeFilter.includes(type)
        ? cardTypeFilter.filter((t) => t !== type)
        : [...cardTypeFilter, type]
    )
  }

  const updateFilterCardRarity = (r: Rarity) => {
    setFilterCardRarity(
      filterCardRarity.includes(r)
        ? filterCardRarity.filter((ra) => ra !== r)
        : [...filterCardRarity, r]
    )
  }

  const clearFilters = () => {
    setFilterText("")
    setFilterFactions([])
    setFiltereManaCost([])
    setCardTypeFilter([])
    setFilterCardRarity([])
  }

  return (
    <FilterContext.Provider
      value={{
        filterManaCost,
        setInitialCards,
        cards,
        filterFactions,
        updateFilterFaction,
        filterText,
        updateFilterText,
        filteredCards,
        updateFilterManaCost,
        cardTypeFilter,
        updateCardTypeFilter,
        filterCardRarity,
        updateFilterCardRarity,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
