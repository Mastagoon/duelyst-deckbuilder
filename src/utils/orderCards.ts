import { CardData, Faction } from "../data/cards"

const orderCards = (cards: CardData[]) => {
  return cards.sort((a, b) => {
    if (a.cardType.toUpperCase() === "GENERAL") {
      //1st card is a general
      if (b.cardType.toUpperCase() === "GENERAL") {
        //2nd card is a general
        // sort by faction
        return Faction[a.faction] ?? 0 > (Faction[b.faction] ?? 0) ? 1 : -1
      }
      return -1
    }
    // for all other cards, sort by mana cost -> faction -> name
    return a.mana > b.mana
      ? 1
      : a.mana < b.mana
      ? -1
      : Faction[a.faction] ?? 0 > (Faction[b.faction] ?? 0)
      ? 1
      : -1
  })
}

export default orderCards
