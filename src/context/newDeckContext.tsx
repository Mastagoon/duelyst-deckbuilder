import React, { useContext } from "react"
import { useState } from "react"
import { CardData, Faction, generalCards, nonTokens } from "../data/cards"
import constants from "../data/constants"
import orderCards from "../utils/orderCards"

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
  minionCount: number
  spellCount: number
  artifactCount: number
  reset: () => void
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
  const [general, setGeneral] = useState<CardData>()
  const [cards, setCards] = useState<DeckCardEntry[]>([])
  const [allowedCards, setAllowedCards] = useState<CardData[]>(generalCards)
  const [minionCount, setMinionCount] = useState(0)
  const [spellCount, setSpellCount] = useState(0)
  const [artifactCount, setArtifactCount] = useState(0)
  const [deckTotal, setDeckTotal] = useState(0)

  const reset = () => {
    setGeneral(undefined)
    setCards([])
    setAllowedCards(generalCards)
    setMinionCount(0)
    setSpellCount(0)
    setArtifactCount(0)
    setDeckTotal(0)
  }

  const updateGeneral = (c: CardData) => {
    // check if we have a general
    if (c.cardType.toUpperCase() !== "GENERAL") return
    // if the new general is from a different faction, remove all the faction cards with it
    if (c.faction !== general?.faction) {
      setAllowedCards(
        orderCards(
          nonTokens.filter((card) => {
            return (
              card.faction === c.faction || card.faction === Faction.neutral
            )
          })
        )
      )
      // remove cards from the old faction
      setCards(
        cards.filter(
          (card) =>
            card.faction === c.faction || card.faction === Faction.neutral
        )
      )
    }
    // finally, replace old general with new one
    setGeneral(c)
  }

  const addCardToDeck = (cardId: number) => {
    // check if a general is set
    // check if the card is legal
    const card = allowedCards.find((c) => c.id === cardId)
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
      changeDeckCount(card.cardType, 1)
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

  const updateAllowedCards = (cardList: CardData[]) => {
    setAllowedCards(cardList)
  }

  const saveDeck = () => {}
  const generateDeckCode = () => {}

  return (
    <NewDeckContext.Provider
      value={{
        minionCount,
        spellCount,
        artifactCount,
        general,
        cards,
        addCardToDeck,
        removeCardFromDeck,
        allowedCards,
        updateAllowedCards,
        saveDeck,
        generateDeckCode,
        reset,
      }}
    >
      {children}
    </NewDeckContext.Provider>
  )
}
