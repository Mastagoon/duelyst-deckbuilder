import { useDeckContext } from "../context/newDeckContext"
import Swal from "sweetalert2"
import { FaClipboard, FaEdit, FaTrash } from "react-icons/fa"
import { useState } from "react"
import Loading from "./Loading"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"

let debounceTimeout: any

const NewDeckList: React.FC = () => {
  const {
    general,
    deckName,
    saveDeck,
    updateDeckName,
    removeCardFromDeck,
    cards,
    minionCount,
    spellCount,
    loadFromDeckCode,
    reset,
    artifactCount,
  } = useDeckContext()
  const [localDeckName, setLocalDeckName] = useState(deckName)
  const [deckCode, setDeckCode] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const { mutateAsync: saveDeckMutation, isLoading } = trpc.useMutation([
    "decksave",
  ])

  const deckTotal = minionCount + spellCount + artifactCount

  const handleImportDeckCode = () => {
    setLoading(true)
    const result = loadFromDeckCode(deckCode)
    if (!result) {
      setLoading(false)
      Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Invalid Deck Code",
        text: "The deck code you entered is invalid.",
        confirmButtonText: "OK",
      })
      return
    }
    setLocalDeckName(deckName)
    setDeckCode("")
    setLoading(false)
    return Swal.fire({
      customClass: {
        popup: "alert-dialog",
      },
      title: "Deck Code Imported",
      text: "The deck code you entered has been imported.",
      timer: 2000,
      showConfirmButton: false,
      position: "bottom-right",
    })
  }

  const handleDeckCardClick = (id: number) => {
    removeCardFromDeck(id)
  }

  const handleUpdateDeckName = (newName: string) => {
    setLocalDeckName(newName)
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      updateDeckName(newName)
    }, 500)
  }

  const handleSaveDeck = async () => {
    // check deck cards
    const cardCount = minionCount + spellCount + artifactCount
    if (cardCount !== 39) {
      return Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Invalid Deck",
        text:
          cardCount < 40
            ? "You need at least 40 cards in your deck"
            : "A deck cannot exceed 40 cards.",
        timer: 2000,
        position: "bottom-right",
        showConfirmButton: false,
      })
    }
    // check deck name
    if (deckName.length > 20) {
      return Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Invalid Deck",
        text: "Your deck name is too long",
        timer: 2000,
        position: "bottom-right",
        showConfirmButton: false,
      })
    }
    // passed all checks
    const code = await saveDeck()
    if (!code || !general) return
    // saved successfully
    const result = await saveDeckMutation({
      generalId: general.id,
      deckName,
      code,
      minionCount,
      faction: general.faction,
      spellCount,
      artifactCount,
    })
    reset()
    router.push(`/deck/${result.id}`)
  }

  const handleReset = async () => {
    const response = await Swal.fire({
      customClass: {
        popup: "alert-dialog",
      },
      title: "Are you sure?",
      text: "Do you want to reset your deck and start over?",
      showCancelButton: true,
      confirmButtonText: "Reset",
    })
    if (!response.isConfirmed) return
    reset()
  }

  return (
    <>
      {(loading || isLoading) && <Loading />}
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
                    deckTotal < 39
                      ? "white"
                      : deckTotal > 39
                      ? "red"
                      : "#0fd700"
                  }`,
                }}
              >
                {deckTotal + (general ? 1 : 0)}
              </span>
              /40 Total
            </span>
          </div>
          <div>Mana Curve placeholder</div>
          <div className="text-md font-bold flex items-center flex-row items-center py-2 gap-1 cursor-pointer">
            <label htmlFor="deckName" className="cursor-pointer">
              <FaEdit className="" />
            </label>
            <input
              name="deckName"
              maxLength={20}
              className="bg-transparent cursor-pointer focus:border-none active:border-none outline-none w-full"
              value={localDeckName}
              onChange={(e) => handleUpdateDeckName(e.target.value)}
            />
          </div>
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
                <div className="h-14 mb-1">
                  <div
                    onClick={handleReset}
                    style={{
                      backgroundImage: `url(/card/deck_builder_card_general_bg.png)`,
                      backgroundSize: "100%",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="flex flex-row justify-start items-center px-1 py-2 my-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative
"
                  >
                    <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-8">
                      {general.name}
                    </span>
                    <div
                      className="absolute right-0 h-20 w-28"
                      style={{
                        backgroundSize: "auto auto",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(/card_sprites/${general.id}.png)`,
                        opacity: 0.5,
                      }}
                    ></div>
                  </div>
                </div>
                {cards.map((c, i) => (
                  <div key={i} className="h-14 relative">
                    <div
                      style={{
                        backgroundImage: `url(/card/deck_builder_card_bg.png)`,
                        backgroundSize: "100%",
                        backgroundRepeat: "no-repeat",
                      }}
                      className="flex flex-row justify-start items-center mb-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative"
                      onClick={() => handleDeckCardClick(c.id)}
                    >
                      <span className="absolute text-lg font-bold left-[1.35rem] text-black">
                        {c.mana}
                      </span>
                      <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-16 uppercase">
                        {c.name}
                      </span>
                      <span className="absolute right-3 top-0 text-black bg-secondary-cyan rounded-sm h-6 w-6 translate-y-1/2 text-sm flex justify-center items-center">
                        x{c.count}
                      </span>
                      <div
                        className="absolute"
                        style={{
                          width:
                            c.cardType.toUpperCase() === "MINION"
                              ? "3.8rem"
                              : "3rem",
                          right:
                            c.cardType.toUpperCase() === "MINION"
                              ? "2.5rem"
                              : "2.25rem",
                          top: c.cardType.toUpperCase() === "MINION" ? "" : "0",
                          height:
                            c.cardType.toUpperCase() === "MINION"
                              ? "5rem"
                              : "3rem",
                          backgroundSize: "auto auto",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: `url(/card_sprites/${c.id}.png)`,
                          opacity: 0.5,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="overflow-hidden">
              <div className="self-center">
                Choose a general to construct a deck
              </div>
              <div className="block font-bold tracking-widest">OR</div>
              <input
                className="bg-transparent text-center mx-auto border-b-2 border-secondary-light-cyan overflow-hidden w-full outline-none cursor-pointer"
                placeholder="Enter Deck Code..."
                value={deckCode}
                onChange={(e) => setDeckCode(e.target.value)}
              />

              <button
                onClick={handleImportDeckCode}
                disabled={!deckCode}
                className="bg-primary-light-purple rounded-sm px-2 hover:opacity-80 cursor-pointer my-2 disabled:opacity-50"
              >
                Import
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-around my-3 px-1 items-center">
          <div className="flex flex-row justify-between gap-5">
            <div className={`border-2 rounded-sm p-1 border-white opacity-60`}>
              <FaClipboard />
            </div>
            <div
              onClick={handleReset}
              className={`border-2 hover:scale-110 hover:opacity-90 transition-all rounded-sm p-1 border-white ${
                general ? "" : "opacity-60"
              }`}
            >
              <FaTrash />
            </div>
          </div>
          <button
            onClick={handleSaveDeck}
            className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}

export default NewDeckList
