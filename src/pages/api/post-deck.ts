import { NextApiRequest, NextApiResponse } from "next"
import { loadDeckFromDeckCode } from "../../utils/deckUtils"
import { prisma } from "../../server/db/client"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(404).json("not foudn")
  const code = JSON.parse(req.body).code
  if (!code) return res.status(400).json("Bad request")
  //check if deck exists
  const deckExists = await prisma.deck.findFirst({ where: { code } })
  if (deckExists) return res.status(200).json("OK")
  // get deck info
  const deck = loadDeckFromDeckCode(code)
  if (!deck) return res.status(400).json("Invalid Deck Code")
  const { general, cards, deckName, minionCount, spellCount, artifactCount } =
    deck

  const result = await prisma.deck.create({
    data: {
      code,
      deckName,
      faction: general?.faction ?? 0,
      generalId: general!.id,
      isPrivate: false,
      spellCount,
      minionCount,
      artifactCount,
      factionCardCount: cards.filter((c) => c.faction === general!.faction)
        .length,
      neutralCardCount: cards.filter((c) => c.faction !== general!.faction)
        .length,
    },
  })
  return res.status(201).json(result)
}

export default handler
