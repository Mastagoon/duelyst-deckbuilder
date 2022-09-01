import { DeckData } from "../../context/newDeckContext"
import { getManaCurve } from "../../utils/deckUtils"
import getFactionColors from "../../utils/getFactionColor"

const ManaCurve: React.FC<{ deck: DeckData }> = ({ deck }) => {
  return (
    <div className="flex flex-row ">
      {getManaCurve(deck.cards).map((c, i) => {
        return (
          <div key={i} className="flex flex-col w-6 justify-end text-center">
            {c.count > 0 && c.count}
            <div
              className="mx-1"
              style={{
                backgroundColor: getFactionColors(deck.general?.faction ?? 0),
                height: `${Math.round(40 * c.ratio)}px`,
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
