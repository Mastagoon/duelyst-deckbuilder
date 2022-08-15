import React, { useContext } from "react"
import { useState } from "react"
import { allCards, CardData } from "../data/cards"
import constants from "../data/constants"

export type DeckCardEntry = CardData & {
  count: number
}

export type DeckData = {
  general?: CardData
  cards: DeckCardEntry[]
  deckCode?: string
}

export interface NewDeckContextType {
  general?: CardData
  cards: DeckCardEntry[]
  addCardToDeck: (cardId: number) => void
  removeCardFromDeck: (cardId: number) => void
  allowedCards: CardData[]
  updateAllowedCards: (cards: CardData[]) => void
  saveDeck: () => void
  generateDeckCode: () => void
}

const NewDeckContext = React.createContext<NewDeckContextType | null>(null)

interface NewDeckContextProps {
  children: React.ReactNode
}

export const useNewDeckContext = () => {
  const context = useContext(NewDeckContext)
  if (context === null) {
    throw new Error("useNewDeckContext must be used within a NewDeckProvider")
  }
  return context
}

export const NewDeckProvider: React.FC<NewDeckContextProps> = ({
  children,
}) => {
  const [general, setGeneral] = useState()
  const [cards, setCards] = useState<DeckCardEntry[]>([])
  const [allowedCards, setAllowedCards] = useState<CardData[]>(allCards)

  const updateGeneral = (cardId: number) => {}

  const addCardToDeck = (cardId: number) => {
    // check if a general is set
    if (!general) return updateGeneral(cardId)
    // check if the card is legal
    const card = allowedCards.find((c) => c.id === cardId)
    if (!card) return
    if (card.cardType === "GENERAL") return updateGeneral(cardId)
    // check if the maximum number of copies of the card is already in the deck
    const cardInDeck = cards.find((c) => c.id === cardId)
    if (cardInDeck) {
      if (cardInDeck.count >= constants.MAX_COPIES_IN_DECK) return
      // increase the number of copies
      setCards(
        cards.map((c) => (c.id === cardId ? { ...c, count: c.count + 1 } : c))
      )
    } else {
      // add the card to the deck
      setCards([...cards, { ...card, count: 1 }])
    }
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
  }

  const updateAllowedCards = (cardList: CardData[]) => {
    setAllowedCards(cardList)
  }

  const saveDeck = () => {}
  const generateDeckCode = () => {}

  return (
    <NewDeckContext.Provider
      value={{
        general,
        cards,
        addCardToDeck,
        removeCardFromDeck,
        allowedCards,
        updateAllowedCards,
        saveDeck,
        generateDeckCode,
      }}
    >
      {children}
    </NewDeckContext.Provider>
  )
}
