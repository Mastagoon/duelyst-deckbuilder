import { DeckCardEntry, DeckData } from "../context/newDeckContext"
import { allCards, CardData, Faction, generalCards } from "../data/cards"

export const generateDeckCode = (
  general: CardData,
  cards: DeckCardEntry[],
  name: string
) => {
  let str = `1:${general.id}`
  for (const card of cards) {
    str += `,${card.count}:${card.id}`
  }
  // encode to base64
  return `[${name}]${Buffer.from(str, "utf8").toString("base64")}`
}

export const parseDeckCode = (
  code: string
): {
  deckName?: string
  generalId: number
  cardsData: { count: number; id: number }[]
} | null => {
  let deckName = ""
  code = code.trim()
  if (code.startsWith("[")) {
    const [codeStr1, codeStr2] = code.split("]")
    deckName = codeStr1?.split("[")[1] || ""
    code = codeStr2 ?? ""
  }
  const codeStr3 = Buffer.from(code ?? "", "base64").toString("utf8")
  if (!codeStr3.length) return null
  const [...csvCards] = codeStr3.split(",")
  const [generalIdAmt, ...cardIds] = csvCards
  const generalId = Number(generalIdAmt?.split(":")[1])
  if (!generalId) return null
  const cardsData = cardIds.map((c) => {
    return {
      id: Number(c.split(":")[1]),
      count: Number(c.split(":")[0]),
    }
  })
  return {
    deckName,
    generalId,
    cardsData,
  }
}

export type ExtendedDeckInfo = DeckData & {
  minionCount: number
  spellCount: number
  artifactCount: number
  minionCards: DeckCardEntry[]
  spellCards: DeckCardEntry[]
  artifactCards: DeckCardEntry[]
  deckName: string
}

export const loadDeckFromDeckCode = (
  code: string
): ExtendedDeckInfo | false => {
  const deck = parseDeckCode(code)
  if (!deck) return false
  const general = generalCards.find((g) => g.id === deck.generalId)
  if (!general) return false
  const cards = deck.cardsData
    .map((cd) => {
      const card = allCards.find((c) => c.id === cd.id)!
      return {
        ...card,
        count: cd.count,
      }
    })
    .sort((a, b) => a.mana - b.mana)
  const minionCards = cards.filter((c) => c.cardType.toUpperCase() === "MINION")
  const spellCards = cards.filter((c) => c.cardType.toUpperCase() === "SPELL")
  const artifactCards = cards.filter(
    (c) => c.cardType.toUpperCase() === "ARTIFACT"
  )
  const deckName = deck.deckName ?? ""
  return {
    general,
    deckCode: code,
    cards,
    minionCards,
    spellCards,
    artifactCards,
    deckName,
    minionCount: minionCards.reduce((tot, curr) => tot + curr.count, 0),
    spellCount: spellCards.reduce((tot, curr) => tot + curr.count, 0),
    artifactCount: artifactCards.reduce((tot, curr) => tot + curr.count, 0),
  }
}

type ManaCurveEntry = {
  neutral: number
  faction: number
}

export const getManaCurve = (deckCards: DeckCardEntry[]) => {
  const absoluteCurve: ManaCurveEntry[] = []
  for (let i = 0; i < 10; i++) {
    absoluteCurve.push({ neutral: 0, faction: 0 })
  }
  let numCards = 0
  for (const card of deckCards) {
    let mana = card.mana
    if (mana > 9) mana = 9
    if (card.faction === Faction.neutral)
      absoluteCurve[mana]!.neutral += card.count
    else absoluteCurve[mana]!.faction += card.count
    numCards += card.count
  }
  // relative mana curve
  const relativeManaCurve = absoluteCurve.map((count, index) => {
    const totalCount = count.faction + count.neutral
    console.log(totalCount)
    console.log(count)
    const ratio = totalCount / numCards
    const factionRatio = totalCount ? count.faction / totalCount : 1
    console.log(factionRatio)
    return {
      mana: index,
      ratio,
      count: totalCount,
      factionRatio,
    }
  })
  return relativeManaCurve
}
