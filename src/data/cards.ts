import cards from "./cards.json"

export type Faction =
  | "lyonar"
  | "songhai"
  | "vetruvian"
  | "abyssian"
  | "magmar"
  | "vanar"
  | "neutral"
export type CardType = "GENERAL" | "MINION" | "SPELL" | "ARTIFACT"
export type Rarity = "basic" | "common" | "rare" | "epic" | "legendary"

export interface CardData {
  id: number
  name: string
  tribes: string[]
  relatedCards: number[]
  resource: {
    breathing?: string
    idle?: string
    walk?: string
    attack?: string
    damage?: string
    death?: string
    castStart?: string
    castEnd?: string
    castLoop?: string
    cast?: string
  }
  faction: number
  cardType: CardType
  description: string
  mana: number
  attack?: number
  health?: number
  rarity: Rarity
  spriteName?: string | null
}

export const cardData: CardData[] = cards as CardData[]

export const cardDataById = cardData.reduce(
  (acc, cardData) => ({
    ...acc,
    [cardData.id]: cardData,
  }),
  {} as Record<number, CardData>
)
