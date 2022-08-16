import { NextPage } from "next"
import CardList from "../components/CardList"
import PageLayout from "../components/PageLayout"
import { nonTokens, CardData, Faction } from "../data/cards"

export const getServerSideProps = async () => {
  const cards = nonTokens
  return {
    props: {
      cards: cards.sort((a, b) => {
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
      }),
    },
  }
}

const CardsPage: NextPage<{ cards: CardData[] }> = ({ cards }) => {
  console.log(cards)
  return (
    <PageLayout>
      <CardList cardList={cards} />
    </PageLayout>
  )
}

export default CardsPage
