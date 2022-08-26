import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  FaArrowDown,
  FaArrowUp,
  FaClipboard,
  FaFire,
  FaKhanda,
  FaPaw,
  FaPen,
  FaShare,
} from "react-icons/fa"
import Swal from "sweetalert2"
import Loading from "../../components/Loading"
import PageLayout from "../../components/PageLayout"
import { useDeckContext } from "../../context/newDeckContext"
import { ExtendedDeckInfo, loadDeckFromDeckCode } from "../../utils/deckCode"
import { trpc } from "../../utils/trpc"
import Head from "next/head"
import DeckCard from "../../components/Deck/DeckCard"
import getFactionColors from "../../utils/getFactionColor"
import constants from "../../data/constants"
import { GiLunarWand } from "react-icons/gi"
import ShareDeckOverlay from "../../components/Deck/ShareDeckOverlay"

const DeckView: React.FC = () => {
  const router = useRouter()
  const [deckInfo, setDeckInfo] = useState<ExtendedDeckInfo>()
  const [loading, setLoading] = useState(false)
  const [deckImage, setDeckImage] = useState<string>("")
  const [showShareDeckOverlay, setShowShareDeckOverlay] = useState(false)

  const { deckId } = router.query
  const { data: deck, isLoading } = trpc.useQuery([
    "deckgetById",
    { id: (deckId as string) ?? "" },
  ])

  const { loadFromDeckCode } = useDeckContext()

  if (!isLoading && !deck) router.push("/")

  const handleCopyDeckCode = async () => {
    const response = await Swal.fire({
      customClass: {
        popup: "alert-dialog",
      },
      title: "Copy deck code",
      text: "You can now share this deck code with others or import it using the in-game import deck function",
      confirmButtonText: "Copy Deck code",
    })
    if (response.isConfirmed) navigator.clipboard.writeText(deck!.code)
  }

  const handleEditDeck = () => {
    loadFromDeckCode(deck!.code)
    router.push(`/deck-builder`)
  }

  const handleShareDeck = async () => {
    if (deckImage) return setShowShareDeckOverlay(true)
    setLoading(true)
    try {
      const png = await fetch(`${constants.deckShareUrl}/${deck?.code}`)
      const blob = await png.blob()
      setDeckImage(URL.createObjectURL(blob))
      setShowShareDeckOverlay(true)
    } catch (err) {}
    setLoading(false)
  }

  useEffect(() => {
    if (deck) {
      const result = loadDeckFromDeckCode(deck.code)
      if (result) setDeckInfo(result)
    }
  }, [deck])

  return (
    <>
      <Head>
        <title>Deck {deck?.deckName ?? "Unknown"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && <Loading t={"Generating deck image..."} />}

      <PageLayout>
        {isLoading && <Loading />}
        {deckInfo && (
          <div className="flex flex-col px-10 text-white pt-5 h-screen grid-rows-[max-content] relative">
            <div className="flex flex-col col-span-12 ml-5">
              <div className="col-span-12 gap-1 flex flex-row mb-3">
                <div className="flex flex-col items-center justify-center text-center text-primary-cyan">
                  <FaArrowUp className="hover:scale-110" />
                  <span className="text-md my-1">0</span>
                  <FaArrowDown className="hover:scale-110" />
                </div>
                <h1 className="md:text-4xl text-2xl font-bold ml-5">
                  Deck List
                </h1>
              </div>
              <h4 className="md:text-2xl text-1xl font-bold ml-5">
                {deckInfo.deckName}
              </h4>
              <span className="text-faint ml-5">
                Created by <span className="text-primary-cyan">Masta</span> .{" "}
                Last updated: <span className="text-white">2 days ago</span>
              </span>
            </div>
            <hr
              style={{
                borderColor: `${getFactionColors(deck?.faction ?? 0)}`,
                borderBottomWidth: "1px",
              }}
              className="my-3 border-0"
            />
            <div className="col-span-12 flex flex-row gap-2 justify-end items-center">
              {/* description */}
              <div>{deck?.description}</div>
              <button
                onClick={handleEditDeck}
                className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer flex flex-row items-center gap-1"
              >
                <FaPen />
                Edit Deck
              </button>
              <button
                onClick={handleCopyDeckCode}
                className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer flex flex-row items-center gap-1"
              >
                <FaClipboard />
                Copy Deck Code
              </button>
              <button
                onClick={handleShareDeck}
                className="bg-primary-light-purple rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer flex flex-row items-center gap-1"
              >
                <FaShare />
                Share Deck
              </button>
            </div>
            <div className="col-span-12 text-center flex flex-wrap justify-around px-10 gap-y-5 overflow-y-scroll h-full py-3 grid-rows-[max-content] gap-5 flex-1">
              <div className="flex flex-col flex-1">
                <div className="flex flex-row items-center justify-center gap-1 text-faint">
                  <FaKhanda />
                  <span className="font-bold">General</span>
                </div>
                <div className="h-14 mb-1">
                  <Link href={`/card/${deckInfo.general?.id}`}>
                    <div
                      className="flex flex-row justify-start items-center px-1 py-2 my-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative
"
                    >
                      <Image
                        src={"/card/deck_builder_card_general_bg.png"}
                        className="z-0"
                        layout="fill"
                      />
                      <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-8">
                        {deckInfo.general?.name}
                      </span>
                      <div
                        className="absolute right-0 h-20 w-28 top-1"
                        style={{
                          backgroundSize: "auto auto",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: `url(/card_sprites/${deckInfo.general?.id}.png)`,
                          opacity: 0.5,
                        }}
                      ></div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex flex-row items-center justify-center text-faint gap-1 mb-1">
                  <FaPaw />
                  <span className="font-bold">
                    Minions{" "}
                    <span className="text-primary-cyan">
                      ({deckInfo.minionCount})
                    </span>
                  </span>
                </div>
                {deckInfo.minionCards.map((c, i) => (
                  <Link href={`/card/${c.id}`} key={i}>
                    <DeckCard c={c} clickCallBack={() => {}} />
                  </Link>
                ))}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex flex-row items-center justify-center text-center text-faint gap-1 mb-1">
                  <FaFire />
                  <span className="font-bold">
                    Spells{" "}
                    <span className="text-primary-cyan">
                      ({deckInfo.spellCount})
                    </span>
                  </span>
                </div>
                {deckInfo.spellCards.map((c, i) => (
                  <Link href={`/card/${c.id}`} key={i}>
                    <DeckCard c={c} clickCallBack={() => {}} />
                  </Link>
                ))}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex flex-row items-center justify-center text-faint gap-1 mb-1">
                  <GiLunarWand />
                  <span className="font-bold">
                    Artifacts{" "}
                    <span className="text-primary-cyan">
                      ({deckInfo.artifactCount})
                    </span>
                  </span>
                </div>
                {deckInfo.artifactCards.map((c, i) => (
                  <Link href={`/card/${c.id}`} key={i}>
                    <DeckCard c={c} clickCallBack={() => {}} />
                  </Link>
                ))}
              </div>
            </div>
            <ShareDeckOverlay
              png={deckImage}
              show={showShareDeckOverlay}
              setShow={setShowShareDeckOverlay}
              id={deck?.id ?? ""}
              deckName={deckInfo.deckName}
            />
          </div>
        )}
      </PageLayout>
    </>
  )
}

export default DeckView
