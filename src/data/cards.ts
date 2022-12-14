import cards from "./cards.json"

const bannedCards = [20424]

export type EnumType = { [s: number]: string }

export const Keywords = [
  "stun",
  "shadow creep",
  "airdrop",
  "celerity",
  "provoke",
  "zeal",
  "rush",
  "ranged",
  "flying",
  "opening gambit",
  "activate",
  "backstab",
  "frenzy",
  "veil",
  "blast",
  "dying wish",
  "rebearth",
]

export const KeywordDescription = {
  stun: "Stunned units skip their next action.",
  shadow_creep:
    "Deal damage to units over Shadow Creep tiles for ever Shadow Creep tile you have.",
  airdrop: "Airdrop units can be summoned on any tile.",
  celerity: "Units with celerity can activate twice every turn.",
  provoke:
    "Nearby enemy units must attack the provoke units. If multiple provoke units are nearby, enemy units may attack any one of them.",
  zeal: "Gain effect when nearby your general.",
  rush: "Units with rush are activated immediately when they are played.",
  ranged: "Units with ranged can attack on any tile.",
  flying: "Flying units can move to any tile.",
  opening_gambit: "Has an effect when played from your action bar.",
  activate: "Allows unit to move or attack.",
  backstab: "Gain effect when attacking an enemy from behind.",
  frenzy: "Also damages the units next to the target unit when attacking.",
  veil: "Cannot be targeted by spells.",
  blast: "Units with blast can attack all enemies in a selected direction.",
  dying_wish: "Trigger effect when the unit dies.",
  rebearth:
    "Spawn an egg of this unit when it dies. At the end of your next turn, transform the egg back into the original unit.",
}

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
  description?: string
  mana: number
  attack?: number
  health?: number
  rarity: Rarity
}

export const generalCards: CardData[] = cards.filter(
  (card) => card.cardType.toUpperCase() === "GENERAL"
) as CardData[]

export const lyonarCards = cards.filter(
  (card) =>
    card.faction === Faction.lyonar && card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]
export const songhaiCards = cards.filter(
  (card) =>
    card.faction === Faction.songhai &&
    card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]
export const vetruvianCards = cards.filter(
  (card) =>
    card.faction === Faction.vetruvian &&
    card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]
export const abyssianCards = cards.filter(
  (card) =>
    card.faction === Faction.abyssian &&
    card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]
export const magmarCards = cards.filter(
  (card) =>
    card.faction === Faction.magmar && card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]
export const vanarCards = cards.filter(
  (card) =>
    card.faction === Faction.vanar && card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]
export const neutralCards = cards.filter(
  (card) =>
    card.faction === Faction.neutral &&
    card.cardType.toUpperCase() !== "GENERAL"
) as CardData[]

export const allCards: CardData[] = [
  ...lyonarCards,
  ...songhaiCards,
  ...vetruvianCards,
  ...abyssianCards,
  ...magmarCards,
  ...vanarCards,
  ...neutralCards,
  ...generalCards,
]

export const nonTokens = allCards.filter(
  (c) => c.rarity.toUpperCase() !== "TOKEN" && bannedCards.indexOf(c.id) === -1
)

export const getFactionCards = (faction: Faction) => {
  switch (faction) {
    case Faction.lyonar:
      return lyonarCards
    case Faction.songhai:
      return songhaiCards
    case Faction.vetruvian:
      return vetruvianCards
    case Faction.abyssian:
      return abyssianCards
    case Faction.magmar:
      return magmarCards
    case Faction.vanar:
      return vanarCards
    case Faction.neutral:
      return neutralCards
  }
}

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
  factions?: Faction[]
) => {
  if (factions && factions.length > 0)
    cards = cards.filter((card) => factions.includes(card.faction))
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

export const HighlightKeywords = (description: string) => {
  if (!description) return ""
  const keywords = Keywords.map((keyword) => `\\b${keyword}\\b`)
  const regex = new RegExp(keywords.join("|"), "gi")
  return description.replace(
    regex,
    (match) =>
      `<span class="font-bold text-secondary-cyan-bold">${match}</span>`
  )
}
