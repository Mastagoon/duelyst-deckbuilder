import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { BsClockHistory } from "react-icons/bs"
import { FiEdit } from "react-icons/fi"
import { AiOutlineEye, AiOutlineShareAlt } from "react-icons/ai"
import Loading from "../../components/Loading"
import PageLayout from "../../components/PageLayout"
import { loadDeckFromDeckCode } from "../../utils/deckUtils"
import { trpc } from "../../utils/trpc"
import Head from "next/head"
import getFactionColors from "../../utils/getFactionColor"
import constants from "../../data/constants"
import ShareDeckOverlay from "../../components/Deck/ShareDeckOverlay"
import timePassedFormat from "../../utils/timePassedFormat"
import ManaCurve from "../../components/Deck/ManaCurve"
import { useSession } from "next-auth/react"
import DeckVoting from "../../components/Deck/DeckVoting"
import DeckCardRatio from "../../components/Deck/DeckCardRatio"
import CopyDeckCode from "../../components/Deck/CopyDeckCode"
import DeckCardInfo from "../../components/Deck/DeckCardInfo"

const DeckView: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deckImage, setDeckImage] = useState<string>("")
  const [showShareDeckOverlay, setShowShareDeckOverlay] = useState(false)

  const { deckId } = router.query
  const { data: deck, isLoading } = trpc.useQuery([
    "deckgetById",
    { id: (deckId as string) ?? "" },
  ])
  const { mutate: deckViewMutation } = trpc.useMutation(["deckview"])

  if (!isLoading && !deck) router.push("/")

  const { data: session } = useSession()

  const handleEditDeck = () => {
    router.push(`/deck-builder?deck=${deck!.code}`)
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
    if (deck) return loadDeckFromDeckCode(deck.code ?? "")
  }, [deck])

  const voted = deck?.votes?.find((v) => v.userId === session?.user.id)

  useEffect(() => {
    if (deckId) deckViewMutation({ deckId: deckId as string })
  }, [deckId])

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
        {deckInfo && deck && (
          <div className="flex flex-col  mx-10 text-white pt-5 h-full grid-rows-[max-content] relative">
            <div className="flex flex-row flex-wrap justify-between items-center">
              <div className="flex flex-col col-span-12 ml-5">
                <div className="col-span-12 gap-1 flex flex-row mb-3 items-center flex-wrap">
                  <DeckVoting
                    totalVotes={deck.votes.reduce(
                      (acc, cur) => acc + cur.vote,
                      0
                    )}
                    vote={voted?.vote ?? 0}
                    deckId={deck.id}
                  />
                  <h1 className="md:text-4xl text-2xl font-bold ml-5 text-white">
                    {deck!.deckName}
                  </h1>
                </div>
                <span className="text-faint ml-5 flex flex-row gap-1 items-center">
                  Created by{" "}
                  {deck.creatorId ? (
                    <Link href={`/user/${deck.creatorId}`}>
                      <span className="text-primary-cyan hover:opacity-80 cursor-pointer">
                        {deck.creator?.name ?? "Guest"}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-primary-cyan hover:opacity-80 cursor-pointer">
                      {deck.creator?.name ?? "Guest"}
                    </span>
                  )}
                </span>
                <div className="flex flex-row items-center text-faint gap-1 ml-5">
                  <BsClockHistory />
                  Last updated:
                  <span className="text-white">
                    {timePassedFormat(deck.updatedAt!)}
                  </span>
                </div>
                <div className="flex flex-row items-center text-faint gap-1 ml-5">
                  <AiOutlineEye />
                  <span className="text-white">{deck._count.views + 1}</span>
                  Views
                </div>
              </div>
              <div className="flex flex-row flex-wrap justify-center lg:justify-between items-center gap-10">
                {/* Card Ratio */}
                <DeckCardRatio
                  faction={deck.faction}
                  factionCards={deck.factionCardCount}
                  neutralCards={deck.neutralCardCount}
                />
                {/* Mana Curve */}
                <div className="flex flex-col self-start">
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex-1 border-faint border-t-[1px]"></div>
                    <span className="">Mana Curve</span>
                    <div className="flex-1 border-faint border-t-[1px]"></div>
                  </div>
                  <div className="flex flex-row ">
                    <ManaCurve
                      cards={deckInfo.cards}
                      faction={deck!.faction ?? 0}
                    />
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
                <div className="break-word lg:w-1/3 text-faint">
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
                  <FiEdit className="text-[#f1f1f1]" />
                  Import Deck
                </button>
                <CopyDeckCode code={deck.code} />
                <button
                  onClick={handleShareDeck}
                  disabled={loading}
                  className={`text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer capitalize transition-all flex flex-row items-center gap-1 bg-vetruvian`}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-pulse animate-bounce rounded-full border-white border-2"></div>
                  ) : (
                    <AiOutlineShareAlt className="text-[#f1f1f1]" />
                  )}
                  {loading ? "Generating Deck Image..." : "Share Deck"}
                </button>
              </div>
            </div>
            <DeckCardInfo
              generalId={deckInfo.general!.id}
              generalName={deckInfo.general!.name}
              minions={deckInfo.minionCards}
              spells={deckInfo.spellCards}
              artifacts={deckInfo.artifactCards}
              minionCount={deckInfo.minionCount}
              spellCount={deckInfo.spellCount}
              artifactCount={deckInfo.artifactCount}
            />
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
