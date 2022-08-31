import { useDeckContext } from "../context/newDeckContext"
import { generateDeckCode } from "../utils/deckCode"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import Swal from "sweetalert2"
import { FaEdit } from "react-icons/fa"
import { useState } from "react"
import Loading from "./Loading"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"
import DeckCard from "./Deck/DeckCard"
import { useSession } from "next-auth/react"
import SaveDeckModal from "./SaveDeckModal"

let debounceTimeout: any

const DeckBuilderScreen: React.FC = () => {
  const {
    general,
    deckName,
    saveDeck,
    updateDeckDescription,
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
  const [copied, setCopied] = useState(false)
  const [showSaveDeckModal, setShowSaveDeckModal] = useState(false)
  const { data: session } = useSession()

  const [parent] = useAutoAnimate<HTMLDivElement>({
    duration: 150,
    easing: "ease-in-out",
  })

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

  const handleCopyCode = () => {
    if (!general) return
    const code = generateDeckCode(general, cards, localDeckName)
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const handleSaveDeck = async () => {
    // check if logged in
    // if not, prompt to login
    if (!session || !session.user.id) {
      const response = await Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Not Logged In",
        text: "You must be logged in to save decks.",
        confirmButtonText: "Login",
        denyButtonText: "Copy Deck Code",
        showDenyButton: true,
      })
      if (response.isDenied) {
        const code = saveDeck()
        navigator.clipboard.writeText(code)
      }
      if (response.isConfirmed) {
        router.push("/login")
      }
      return
    }
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
    setShowSaveDeckModal(true)
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
      <div className="bg-tester-color border-l-2 border-secondary-dark-blue shadow-lg text-[rgba(200,200,230,1)] flex flex-col justify-between text-white h-screen w-full px-2 select-none">
        <div className="flex flex-col">
          <div className="text-2xl font-bold flex items-center flex-row items-center py-2 gap-1 cursor-pointer">
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
          <div className="border-b-[1px] border-faint my-2"></div>
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
                      ? "rgba(200,200,230,1)"
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
        </div>
        <div className="border-b-[1px] text-faint"></div>
        <div
          className={`flex flex-col text-center overflow-y-scroll h-full px-1 ${
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
                    className="flex flex-row justify-start items-center px-1 py-2 my-1 rounded-md gap-2 cursor-pointer transition-all h-14 relative
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
                <div className="h-screen" ref={parent}>
                  {cards.map((c, i) => (
                    <DeckCard
                      c={c}
                      clickCallBack={handleDeckCardClick}
                      key={i}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="overflow-hidden">
              <div className="self-center">
                Choose a general to construct a deck
              </div>
              <div className="block font-bold tracking-widest">OR</div>
              <input
                className="bg-transparent text-center mx-auto border-b-[1px] border-faint overflow-hidden w-full outline-none cursor-pointer"
                placeholder="Enter Deck Code..."
                value={deckCode}
                onChange={(e) => setDeckCode(e.target.value)}
              />

              <button
                onClick={handleImportDeckCode}
                disabled={!deckCode}
                className="bg-vetruvian text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer my-2 disabled:opacity-50"
              >
                Import
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-around my-3 px-1 items-center">
          <div className="flex flex-row justify-between gap-5">
            <button
              disabled={!general}
              onClick={handleCopyCode}
              className={`text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer uppercase transition-all ${
                copied ? "bg-green-600" : "disabled:opacity-50 bg-vetruvian"
              }`}
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button
              onClick={handleSaveDeck}
              disabled={minionCount + spellCount + artifactCount !== 39}
              className="bg-vetruvian text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer uppercase disabled:opacity-50"
            >
              Save Deck
            </button>
          </div>
        </div>
      </div>
      <SaveDeckModal show={showSaveDeckModal} setShow={setShowSaveDeckModal} />
    </>
  )
}

export default DeckBuilderScreen
