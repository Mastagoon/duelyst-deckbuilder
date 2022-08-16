import { useNewDeckContext } from "../context/newDeckContext"
import constants from "../data/constants"
import ManaGem from "./Card/ManaGem"
import getFactionColor from "../utils/getFactionColor"
import { useState } from "react"
import { FaClipboard, FaShare } from "react-icons/fa"

const NewDeckList: React.FC = () => {
  const [resetCounter, setResetCounter] = useState(0)
  const {
    general,
    removeCardFromDeck,
    cards,
    minionCount,
    spellCount,
    reset,
    artifactCount,
  } = useNewDeckContext()

  const deckTotal = minionCount + spellCount + artifactCount

  const handleDeckCardClick = (id: number) => {
    removeCardFromDeck(id)
  }

  const handleSaveDeck = () => {}

  const handleReset = () => {
    if (resetCounter < 1) {
      alert("Click again to reset your deck")
      setResetCounter(1)
      setTimeout(() => {
        setResetCounter(0)
      }, 1000)
    } else reset()
  }

  return (
    <div className="bg-secondary-dark-blue flex flex-col justify-between text-white h-screen w-full px-2 select-none">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <span>Minions: {minionCount}</span>
            <span>Spells: {spellCount}</span>
            <span>Artifacts: {artifactCount}</span>
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
        <div>Mana Curve placeholder</div>
      </div>
      <hr />
      <div
        className={`reverse-gradient-border flex flex-col text-center overflow-y-scroll h-full px-1 ${
          !general && "items-center justify-center"
        }`}
      >
        {general ? (
          <>
            <div className="flex flex-col overflow-x-hidden cursor-pointer">
              <div
                onClick={handleReset}
                style={{
                  backgroundImage: `url(${constants.imageUrl}/${general.resource.idle})`,
                  backgroundSize: "40px 150%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "100% 50%",
                  border: `1px solid ${getFactionColor(general.faction)}`,
                }}
                className="flex flex-row px-1 py-2 my-1 rounded-md gap-2 bg-primary-dark-blue cursor-pointer hover:scale-110 transition-all
"
              >
                <ManaGem className="w-5 h-5" cost={0} />
                <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer">
                  {general.name}
                </span>
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
                      backgroundPosition: "100% 50%",
                      border: `1px solid `,
                      borderLeft: `1px solid ${getFactionColor(c.faction)}`,
                      borderBottom: `1px solid ${getFactionColor(c.faction)}`,
                    }}
                    className="flex flex-row px-1 py-2 my-1 rounded-md gap-2 bg-primary-dark-blue cursor-pointer hover:scale-110 transition-all"
                  >
                    <ManaGem className="w-5 h-5" cost={c.mana} />
                    <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer">
                      {c.name}
                    </span>
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
      <div className="flex flex-row justify-between my-3 px-1 items-center">
        <div className="flex flex-row justify-between gap-5">
          <div className={`border-2 rounded-sm p-1 border-white opacity-60`}>
            <FaClipboard />
          </div>
          <div className={`border-2 rounded-sm p-1 border-white opacity-60`}>
            <FaShare />
          </div>
        </div>
        <button
          onClick={handleSaveDeck}
          className="bg-primary-light-purple rounded-sm px-2 hover:opacity-80 cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default NewDeckList
