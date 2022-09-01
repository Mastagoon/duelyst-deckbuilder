import { DeckCardEntry, DeckData } from "../../context/newDeckContext"
import { Faction } from "../../data/cards"
import { getManaCurve } from "../../utils/deckUtils"
import getFactionColors from "../../utils/getFactionColor"

const ManaCurve: React.FC<{ cards: DeckCardEntry[]; faction: Faction }> = ({
  cards,
  faction,
}) => {
  return (
    <div className="flex flex-row h-[110px] w-full px-5">
      {getManaCurve(cards).map((c, i) => {
        return (
          <div key={i} className="flex flex-col justify-end text-center w-full">
            {c.count > 0 && c.count}
            <div
              className="mx-1 transition-all duration-1000"
              style={{
                backgroundColor: getFactionColors(faction),
                height: `${Math.floor(90 * c.ratio) * c.factionRatio}px`,
              }}
            ></div>
            <div
              className="mx-1 transition-all duration-1000 bg-faint"
              style={{
                height: `${Math.floor(90 * c.ratio) * (1 - c.factionRatio)}px`,
              }}
            ></div>
            <div className="bg-white w-full h-[1px] mb-1"></div>
            <div
              className="mx-auto flex items-center justify-center text-xs text-black "
              style={{
                height: "20px",
                width: "20px",
                backgroundImage: `url(/card/icon_mana.png)`,
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
              }}
            >
              {i}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ManaCurve
