import { useNewDeckContext } from "../context/newDeckContext"
import constants from "../data/constants"
import ManaGem from "./Card/ManaGem"
import getFactionColor from "../utils/getFactionColor"

const NewDeckList: React.FC = () => {
  const {
    general,
    removeCardFromDeck,
    cards,
    minionCount,
    spellCount,
    artifactCount,
  } = useNewDeckContext()

  const deckTotal = minionCount + spellCount + artifactCount

  const handleDeckCardClick = (id: number) => {
    removeCardFromDeck(id)
  }

  return (
    <div className="bg-secondary-dark-blue flex flex-col justify-between text-white h-screen w-full px-2">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <span>M: {minionCount}</span>
            <span>S: {spellCount}</span>
            <span>A: {artifactCount}</span>
          </div>
          <span className="tracking-wide">
            <span
              style={{
                color: `${
                  deckTotal < 40 ? "white" : deckTotal > 40 ? "red" : "#0fd700"
                }`,
              }}
            >
              {deckTotal}
            </span>
            /40 Total
          </span>
        </div>
        <div>Mana Curve</div>
      </div>
      <hr />
      <div
        className={`reverse-gradient-border flex flex-col text-center overflow-y-scroll h-full px-1 ${
          !general && "items-center justify-center"
        }`}
      >
        {general ? (
          <>
            <div className="flex flex-col overflow-x-hidden">
              <div
                style={{
                  backgroundImage: `url(${constants.imageUrl}/${general.resource.idle})`,
                  backgroundSize: "40px 150%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "100% 100%",
                  border: `1px solid ${getFactionColor(general.faction)}`,
                }}
                className="flex flex-row px-1 py-2 my-1 rounded-md gap-2 bg-primary-dark-blue cursor-pointer hover:scale-110 transition-all
"
              >
                <ManaGem className="w-5 h-5" cost={0} />
                <span className="text-sm font-bold">{general.name}</span>
              </div>
              {cards.map((c, i) => (
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleDeckCardClick(c.id)}
                  key={i}
                >
                  <span className="absolute right-0 top-0 text-black bg-primary-cyan rounded-full -translate-y-1/2 text-sm">
                    x{c.count}
                  </span>
                  <div
                    style={{
                      backgroundImage: `url(${constants.imageUrl}/${c.resource.idle})`,
                      backgroundSize: "40px 150%",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "100% 100%",
                      border: `1px solid `,
                      borderLeft: `1px solid ${getFactionColor(c.faction)}`,
                      borderBottom: `1px solid ${getFactionColor(c.faction)}`,
                    }}
                    className="flex flex-row px-1 py-2 my-1 rounded-md gap-2 bg-primary-dark-blue cursor-pointer hover:scale-110 transition-all"
                  >
                    <ManaGem className="w-5 h-5" cost={c.mana} />
                    <span className="text-sm font-bold">{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="self-center">
            Choose a general to construct a deck
          </div>
        )}
      </div>
      <div>Save / Share</div>
    </div>
  )
}

export default NewDeckList
