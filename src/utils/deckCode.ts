import { DeckCardEntry } from "../context/newDeckContext"
import { CardData } from "../data/cards"

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
  const [codeStr1, codeStr2] = code.split("]")
  const deckName = codeStr1?.split("[")[1] || ""
  const codeStr3 = Buffer.from(codeStr2 ?? "", "base64").toString("utf8")
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
