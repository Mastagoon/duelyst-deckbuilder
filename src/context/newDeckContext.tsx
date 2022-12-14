import React, { useContext, useDeferredValue, useMemo } from "react"
import { useState } from "react"
import {
  CardData,
  Faction,
  generalCards,
  getFactionCards,
  queryFromCards,
} from "../data/cards"
import constants from "../data/constants"
import { generateDeckCode, loadDeckFromDeckCode } from "../utils/deckUtils"

export type DeckCardEntry = CardData & {
  count: number
}

export type DeckData = {
  general?: CardData
  cards: DeckCardEntry[]
  deckCode?: string
}

export interface DeckContextType {
  general?: CardData
  deckName: string
  updateDeckName: (name: string) => void
  deckDescription: string
  updateDeckDescription: (description: string) => void
  cards: DeckCardEntry[]
  addCardToDeck: (cardId: number) => void
  removeCardFromDeck: (cardId: number) => void
  factionCards: CardData[]
  neutralCards: CardData[]
  saveDeck: () => string
  minionCount: number
  spellCount: number
  artifactCount: number
  filterText: string
  updateFilterText: (query: string) => void
  reset: () => void
  loadFromDeckCode: (code: string) => boolean
}

const DeckContext = React.createContext<DeckContextType | null>(null)

interface DeckContextProps {
  children: React.ReactNode
}

export const useDeckContext = () => {
  const context = useContext(DeckContext)
  if (context === null) {
    throw new Error("useDeckContext must be used within a DeckProvider")
  }
  return context
}

export const NewDeckProvider: React.FC<DeckContextProps> = ({ children }) => {
  const [filterText, setFilterText] = useState("")
  const [general, setGeneral] = useState<CardData>()
  const [deckName, setDeckName] = useState("New Deck")
  const [cards, setCards] = useState<DeckCardEntry[]>([])
  const [minionCount, setMinionCount] = useState(0)
  const [spellCount, setSpellCount] = useState(0)
  const [artifactCount, setArtifactCount] = useState(0)
  const [deckTotal, setDeckTotal] = useState(0)
  const [deckDescription, setDeckDescription] = useState("")

  const deferredQuery = useDeferredValue(filterText)

  const factionCards = useMemo(() => {
    if (general) {
      return getFactionCards(general.faction).filter(
        (c) =>
          (c.rarity.toLowerCase() !== "token" &&
            c.id !== 20424 &&
            c.name.toLowerCase().includes(deferredQuery.toLowerCase())) ||
          c.description?.toLowerCase().includes(deferredQuery.toLowerCase())
      )
    }
  }, [general, deferredQuery])

  const neutralCards = useMemo(() => {
    return getFactionCards(Faction.neutral).filter(
      (c) =>
        c.rarity.toLowerCase() !== "token" &&
        (c.name.toLowerCase().includes(deferredQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(deferredQuery.toLowerCase()))
    )
  }, [deferredQuery])

  const reset = () => {
    setGeneral(undefined)
    setCards([])
    setMinionCount(0)
    setSpellCount(0)
    setArtifactCount(0)
    setDeckTotal(0)
  }

  const updateGeneral = (c: CardData) => {
    // check if we have a general
    if (c.cardType.toUpperCase() !== "GENERAL") return
    // finally, replace old general with new one
    setGeneral(c)
  }

  const addCardToDeck = (cardId: number) => {
    // check if a general is set
    // check if the card is legal
    const card = general
      ? [...(factionCards ?? []), ...neutralCards].find((c) => c.id === cardId)
      : generalCards.find((g) => g.id === cardId)
    if (!card) return
    if (card.cardType.toUpperCase() === "GENERAL") return updateGeneral(card)
    if (!general) return
    // check if the maximum number of copies of the card is already in the deck
    const cardInDeck = cards.find((c) => c.id === cardId)
    if (cardInDeck) {
      if (cardInDeck.count >= constants.MAX_COPIES_IN_DECK) return
      // increase the number of copies
      setCards(
        cards.map((c) => (c.id === cardId ? { ...c, count: c.count + 1 } : c))
      )
    } else {
      // add the card to the deck at the specified index based on mana cost
      let i = 0
      for (const c of cards) {
        if (c.mana > card.mana) {
          const tempArr = cards
          tempArr.splice(i, 0, { ...card, count: 1 })
          setCards(tempArr)
          changeDeckCount(card.cardType, 1)
          return
        }
        i++
      }
      // no cards in the deck have a higher mana cost than the card, so add it to the end
      setCards([...cards, { ...card, count: 1 }])
    }
    changeDeckCount(card.cardType, 1)
  }

  const removeCardFromDeck = (cardId: number) => {
    const card = cards.find((c) => c.id === cardId)
    if (!card || card.cardType === "GENERAL") return
    if (card.count === 1) {
      setCards(cards.filter((c) => c.id !== cardId))
    } else {
      setCards(
        cards.map((c) => (c.id === cardId ? { ...c, count: c.count - 1 } : c))
      )
    }
    changeDeckCount(card.cardType, -1)
  }

  const changeDeckCount = (cardType: string, count: number) => {
    switch (cardType.toUpperCase()) {
      default:
      case "MINION":
        setMinionCount(minionCount + count)
        break
      case "SPELL":
        setSpellCount(spellCount + count)
        break
      case "ARTIFACT":
        setArtifactCount(artifactCount + count)
        break
    }
  }

  const updateFilterText = (text: string) => {
    setFilterText(text)
  }

  const saveDeck = () => {
    // #TODO
    // 1: check the deck validity
    if (minionCount + spellCount + artifactCount !== 39 || !general) return ""
    // 2: create deck code
    const code = generateDeckCode(general, cards, deckName)
    return code ?? ""
    // 3: save deck to database
  }

  const loadFromDeckCode = (code: string) => {
    const result = loadDeckFromDeckCode(code)
    if (!result || !result.general) return false
    updateGeneral(result.general)
    setCards(result.cards)
    setMinionCount(result.minionCount)
    setSpellCount(result.spellCount)
    setArtifactCount(result.artifactCount)
    setDeckName(result.deckName)
    return true
  }

  const updateDeckDescription = (d: string) => {
    setDeckDescription(d)
  }

  return (
    <DeckContext.Provider
      value={{
        deckName,
        updateDeckName: setDeckName,
        filterText,
        updateFilterText,
        minionCount,
        spellCount,
        artifactCount,
        general,
        cards,
        addCardToDeck,
        removeCardFromDeck,
        saveDeck,
        reset,
        loadFromDeckCode,
        deckDescription,
        updateDeckDescription,
        factionCards: factionCards ?? [],
        neutralCards,
      }}
    >
      {children}
    </DeckContext.Provider>
  )
}
