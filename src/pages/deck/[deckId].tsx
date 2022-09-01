import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { BsClockHistory } from "react-icons/bs"
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
import Loading from "../../components/Loading"
import PageLayout from "../../components/PageLayout"
import { loadDeckFromDeckCode } from "../../utils/deckUtils"
import { trpc } from "../../utils/trpc"
import Head from "next/head"
import DeckCard from "../../components/Deck/DeckCard"
import getFactionColors from "../../utils/getFactionColor"
import constants from "../../data/constants"
import { GiLunarWand } from "react-icons/gi"
import ShareDeckOverlay from "../../components/Deck/ShareDeckOverlay"
import timePassedFormat from "../../utils/timePassedFormat"
import { Faction } from "../../data/cards"
import ManaCurve from "../../components/Deck/ManaCurve"

const DeckView: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deckImage, setDeckImage] = useState<string>("")
  const [showShareDeckOverlay, setShowShareDeckOverlay] = useState(false)
  const [copied, setCopied] = useState(false)

  const { deckId } = router.query
  const { data: deck, isLoading } = trpc.useQuery([
    "deckgetById",
    { id: (deckId as string) ?? "" },
  ])

  if (!isLoading && !deck) router.push("/")

  const handleCopyDeckCode = async () => {
    navigator.clipboard.writeText(deck!.code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const handleEditDeck = () => {
    router.push(`/deck-builder/${deck!.code}`)
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

  const deckInfo = useMemo(() => {
    if (deck) return loadDeckFromDeckCode(deck.code)
  }, [deck])

  return (
    <>
      <Head>
        <title>{deck?.deckName ?? "Unknown"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="Duelyst Deckbuilder" />
        <meta property="og:title" content={`${deck?.deckName}`} />
        <meta
          property="og:image"
          content={`/card_sprites/${deck?.generalId}.png`}
        />
      </Head>
      <PageLayout>
        {isLoading && <Loading />}
        {deckInfo && (
          <div className="flex flex-col  mx-10 text-white pt-5 h-full grid-rows-[max-content] relative">
            <div className="flex flex-row flex-wrap justify-between items-center">
              <div className="flex flex-col col-span-12 ml-5">
                <div className="col-span-12 gap-1 flex flex-row mb-3 items-center flex-wrap">
                  <div className="flex flex-col items-center justify-center text-center text-primary-cyan">
                    <FaArrowUp className="hover:scale-110" />
                    <span className="text-md my-1">0</span>
                    <FaArrowDown className="hover:scale-110" />
                  </div>
                  <h1 className="md:text-4xl text-2xl font-bold ml-5">
                    {deckInfo.deckName}
                  </h1>
                </div>
                <span className="text-faint ml-5 flex flex-row gap-1 items-center">
                  Created by{" "}
                  <Link href={`/user/${deck?.creatorId}`}>
                    <span className="text-primary-cyan hover:opacity-80 cursor-pointer">
                      {deck?.creator.name}
                    </span>
                  </Link>
                </span>
                <div className="flex flex-row items-center text-faint gap-1 ml-5">
                  <BsClockHistory />
                  Last updated:
                  <span className="text-white">
                    {timePassedFormat(deck!.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-row flex-wrap justify-center lg:justify-between items-center gap-10">
                {" "}
                {/* Card Ratio */}
                <div className="flex flex-col self-start">
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex-1 border-faint border-t-[1px]"></div>
                    <span className="">Card Ratio</span>
                    <div className="flex-1 border-faint border-t-[1px]"></div>
                  </div>
                  <div className="flex flex-col capitalize">
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        height={30}
                        width={30}
                        src={`/icons/factions/${
                          Faction[deck?.faction ?? 0]
                        } rune.png`}
                      />
                      <div className="flex flex-row items-center">
                        <div
                          className="h-3 w-1"
                          style={{
                            backgroundColor: getFactionColors(deck!.faction),
                          }}
                        ></div>
                        {[...Array(deck!.factionCardCount)].map(() => (
                          <div
                            style={{
                              backgroundColor: getFactionColors(deck!.faction),
                            }}
                            className={`h-3 w-1`}
                          ></div>
                        ))}
                        <span className="mx-2 text-sm">
                          {deck!.factionCardCount} cards
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 justify-start">
                      <Image
                        height={30}
                        width={30}
                        src={`/icons/factions/neutral rune.png`}
                      />
                      <div className="flex flex-row items-center">
                        <div className="h-3 w-1 bg-white"></div>
                        {[...Array(deck!.neutralCardCount)].map(() => (
                          <div className="h-3 w-1 bg-white"></div>
                        ))}
                        <span className="mx-2 text-sm">
                          {deck!.neutralCardCount} cards
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Mana Curve */}
                <div className="flex flex-col self-start">
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex-1 border-faint border-t-[1px]"></div>
                    <span className="">Mana Curve</span>
                    <div className="flex-1 border-faint border-t-[1px]"></div>
                  </div>
                  <div className="flex flex-row ">
                    <ManaCurve cards={deckInfo.cards} faction={deck!.faction} />
                  </div>
                </div>
              </div>
            </div>
            <hr
              style={{
                borderColor: `${getFactionColors(deck?.faction ?? 0)}`,
                borderBottomWidth: "1px",
              }}
              className="my-3 border-0"
            />
            <div className="col-span-12 flex flex-row gap-2 justify-center lg:justify-between items-start my-2 flex-wrap">
              {/* description */}
              {deck?.description ? (
                <div className="break-all lg:w-1/3 text-faint">
                  <h1 className="text-white text-xl">Description:</h1>
                  <p className=""> {deck.description}</p>
                </div>
              ) : (
                <div></div>
              )}
              <div className="flex flex-col lg:flex-row justify-end gap-2 items-start flex-warp">
                <button
                  onClick={handleEditDeck}
                  className={`text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer capitalize transition-all flex flex-row items-center gap-1 bg-vetruvian`}
                >
                  <FaPen />
                  Edit Deck
                </button>
                <button
                  disabled={copied}
                  onClick={handleCopyDeckCode}
                  className={`text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer capitalize transition-all flex flex-row items-center gap-1 ${
                    copied ? "bg-green-600" : "disabled:opacity-50 bg-vetruvian"
                  }`}
                >
                  {copied ? (
                    "Copied!"
                  ) : (
                    <>
                      {" "}
                      <FaClipboard />
                      Copy Deck Code
                    </>
                  )}
                </button>
                <button
                  onClick={handleShareDeck}
                  disabled={loading}
                  className={`text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer capitalize transition-all flex flex-row items-center gap-1 bg-vetruvian`}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-pulse animate-bounce rounded-full border-white border-2"></div>
                  ) : (
                    <FaShare />
                  )}
                  {loading ? "Generating Deck Code..." : "Share Deck"}
                </button>
              </div>
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
                    <div>
                      <DeckCard c={c} />
                    </div>
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
                    <div>
                      <DeckCard c={c} />
                    </div>
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
                    <div>
                      <DeckCard c={c} />
                    </div>
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
