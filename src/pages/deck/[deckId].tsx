import { useRouter } from "next/router"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaArrowDown, FaArrowUp, FaClipboard, FaPen } from "react-icons/fa"
import Swal from "sweetalert2"
import ManaGem from "../../components/Card/ManaGem"
import Loading from "../../components/Loading"
import PageLayout from "../../components/PageLayout"
import { useDeckContext } from "../../context/newDeckContext"
import constants from "../../data/constants"
import { ExtendedDeckInfo, loadDeckFromDeckCode } from "../../utils/deckCode"
import getFactionColor from "../../utils/getFactionColor"
import { trpc } from "../../utils/trpc"
import Head from "next/head"

const DeckView: React.FC = () => {
  const router = useRouter()
  const [deckInfo, setDeckInfo] = useState<ExtendedDeckInfo>()
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

      <PageLayout>
        {isLoading && <Loading />}
        {deckInfo && (
          <div className="flex flex-col px-10 text-white pt-5 h-screen grid-rows-[max-content]">
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
            </div>
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
            </div>
            <div className="col-span-12 text-center flex flex-wrap justify-around px-10 gap-y-5 gradient-border overflow-y-scroll h-full py-3 grid-rows-[max-content] gap-5 flex-1">
              <div className="flex flex-col flex-1">
                <span className="font-bold">General</span>
                <div className="h-14 mb-1">
                  <Link href={`/card/${deckInfo.general?.id}`}>
                    <div
                      style={{
                        backgroundImage: `url(/card/deck_builder_card_general_bg.png)`,
                        backgroundSize: "100%",
                        backgroundRepeat: "no-repeat",
                      }}
                      className="flex flex-row justify-start items-center px-1 py-2 my-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative
"
                    >
                      <span className="text-sm font-bold overflow-hidden whitespace-nowrap cursor-pointer ml-8">
                        {deckInfo.general?.name}
                      </span>
                      <div
                        className="absolute right-0 h-20 w-28"
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
                <span className="font-bold">
                  Minions{" "}
                  <span className="text-primary-cyan">
                    ({deckInfo.minionCount})
                  </span>
                </span>
                {deckInfo.minionCards.map((c, i) => (
                  <Link href={`/card/${c.id}`} key={i}>
                    <div className="h-14 relative">
                      <div
                        style={{
                          backgroundImage: `url(/card/deck_builder_card_bg.png)`,
                          backgroundSize: "100%",
                          backgroundRepeat: "no-repeat",
                        }}
                        className="flex flex-row justify-start items-center mb-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative"
                      >
                        <span className="absolute text-lg font-bold top-3 left-[1.22rem] text-black">
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
                            top:
                              c.cardType.toUpperCase() === "MINION" ? "" : "0",
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
                  </Link>
                ))}
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold">
                  Spells{" "}
                  <span className="text-primary-cyan">
                    ({deckInfo.spellCount})
                  </span>
                </span>
                {deckInfo.spellCards.map((c, i) => (
                  <Link href={`/card/${c.id}`} key={i}>
                    <div className="h-14 relative">
                      <div
                        style={{
                          backgroundImage: `url(/card/deck_builder_card_bg.png)`,
                          backgroundSize: "100%",
                          backgroundRepeat: "no-repeat",
                        }}
                        className="flex flex-row justify-start items-center mb-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative"
                      >
                        <span className="absolute text-lg font-bold top-3 left-[1.22rem] text-black">
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
                            top:
                              c.cardType.toUpperCase() === "MINION" ? "" : "0",
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
                  </Link>
                ))}
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold">
                  Artifacts{" "}
                  <span className="text-primary-cyan">
                    ({deckInfo.artifactCount})
                  </span>
                </span>
                {deckInfo.artifactCards.map((c, i) => (
                  <Link href={`/card/${c.id}`} key={i}>
                    <div className="h-14 relative">
                      <div
                        style={{
                          backgroundImage: `url(/card/deck_builder_card_bg.png)`,
                          backgroundSize: "100%",
                          backgroundRepeat: "no-repeat",
                        }}
                        className="flex flex-row justify-start items-center mb-1 rounded-md gap-2 cursor-pointer hover:scale-110 transition-all h-14 relative"
                      >
                        <span className="absolute text-lg font-bold left-[1.22rem] top-3 text-black">
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
                            top:
                              c.cardType.toUpperCase() === "MINION" ? "" : "0",
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
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </>
  )
}

export default DeckView
