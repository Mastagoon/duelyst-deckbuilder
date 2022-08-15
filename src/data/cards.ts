import cards from "./cards.json"

export type EnumType = { [s: number]: string }

export enum Faction {
  "lyonar" = 1,
  "songhai",
  "vetruvian",
  "abyssian",
  "magmar",
  "vanar",
  "neutral" = 100,
}

// export type Faction =
// | "lyonar"
// | "songhai"
// | "vetruvian"
// | "abyssian"
// | "magmar"
// | "vanar"
// | "neutral"
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
    blurPlaceholder?: string
  }
  faction: Faction
  cardType: CardType
  description: string
  mana: number
  attack?: number
  health?: number
  rarity: Rarity
  spriteName?: string | null
}

export const lyonarCards = cards.filter(
  (card) => card.faction === Faction.lyonar
) as CardData[]
export const songhaiCards = cards.filter(
  (card) => card.faction === Faction.songhai
) as CardData[]
export const vetruvianCards = cards.filter(
  (card) => card.faction === Faction.vetruvian
) as CardData[]
export const abyssianCards = cards.filter(
  (card) => card.faction === Faction.abyssian
) as CardData[]
export const magmarCards = cards.filter(
  (card) => card.faction === Faction.magmar
) as CardData[]
export const vanarCards = cards.filter(
  (card) => card.faction === Faction.vanar
) as CardData[]
export const neutralCards = cards.filter(
  (card) => card.faction === Faction.neutral
) as CardData[]

export const allCards: CardData[] = [
  ...lyonarCards,
  ...songhaiCards,
  ...vetruvianCards,
  ...abyssianCards,
  ...magmarCards,
  ...vanarCards,
  ...neutralCards,
]

export const generalCards: CardData[] = allCards.filter(
  (card) => card.cardType === "GENERAL"
)

export const cardDataById = allCards.reduce(
  (acc, cardData) => ({
    ...acc,
    [cardData.id]: cardData,
  }),
  {} as Record<number, CardData>
)

export const queryFromCards = (
  cards: CardData[],
  text = "",
  faction?: Faction
) => {
  if (faction) cards = cards.filter((card) => card.faction === faction)
  return text === ""
    ? cards
    : cards.filter(
        (card) =>
          card.name.toLowerCase().includes(text.toLowerCase()) ||
          card.description?.toLowerCase().includes(text.toLowerCase()) ||
          card.tribes.some((tribe) =>
            tribe.toLowerCase().includes(text.toLowerCase())
          )
      )
}
