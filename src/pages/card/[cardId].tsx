import { useRouter } from "next/router"
import Image from "next/image"
import { useEffect, useState } from "react"
import PageLayout from "../../components/PageLayout"
import {
  allCards,
  CardData,
  cardDataById,
  Faction,
  HighlightKeywords,
  KeywordDescription,
  Keywords,
} from "../../data/cards"
import getFactionColor from "../../utils/getFactionColor"
import getFactionColors from "../../utils/getFactionColor"
import constants from "../../data/constants"
import {
  FaArrowLeft,
  FaArrowRight,
  FaFire,
  FaKhanda,
  FaPaw,
  FaRegHandRock,
} from "react-icons/fa"
import { BsFillHexagonFill, BsHeartFill } from "react-icons/bs"
import { TbSword } from "react-icons/tb"
import Link from "next/link"

const CardView: React.FC = () => {
  const [card, setCard] = useState<CardData>()
  const [animationList, setAnimationList] = useState<string[]>([])
  const [currentAnimation, setCurrentAnimation] =
    useState<keyof CardData["resource"]>("idle")

  const router = useRouter()
  const { cardId } = router.query

  const loadPreviousAnimation = () => {
    const index = animationList.indexOf(currentAnimation)
    if (index > 0) {
      setCurrentAnimation(
        animationList[index - 1] as keyof CardData["resource"]
      )
    } else {
      setCurrentAnimation(
        animationList[animationList.length - 1] as keyof CardData["resource"]
      )
    }
  }

  const loadNextAnimation = () => {
    const nextAnimation =
      animationList[animationList.indexOf(currentAnimation) + 1] ??
      animationList[0]
    setCurrentAnimation(nextAnimation as keyof CardData["resource"])
  }

  useEffect(() => {
    if (cardId) {
      const card = allCards.find((c) => c.id === Number(cardId))
      if (card) {
        setCard(card)
        setAnimationList(Object.keys(card.resource))
      } else router.push("/")
    }
  }, [cardId])

  return (
    <PageLayout>
      {card && (
        <div className="grid grid-cols-12 my-5 text-white">
          <div className="md:col-span-2 hidden md:inline"></div>
          <div className="md:col-span-10 col-span-12 lg:ml-5 mt-20 flex flex-col text-center md:text-left">
            <h1 className="md:text-4xl text-2xl font-bold md:ml-5 uppercase text-white">
              {card.name}
            </h1>
            <h3
              style={{ color: getFactionColors(card.faction) }}
              className="md:text-2xl text-xl font-bold md:ml-5 uppercase"
            >
              {Faction[card.faction]}
            </h3>
            <div className="flex flex-row gap-5 flex-wrap md:items-start items-center justify-center md:justify-start">
              <div className="flex flex-col justify-center items-center">
                <div
                  style={{
                    border: `1px solid ${getFactionColor(card.faction)}`,
                  }}
                  className="w-52 h-full card-border cursor-pointer transition-all m-2 relative flex flex-col rounded-md bg-primary-dark-blue h-[270px] p-1 select-none bg-no-repeat bg-cover text-center"
                >
                  <div
                    className="flex-1 pixelated animation-fade animate-slideInFromBottom"
                    style={{
                      //@ts-ignore
                      backgroundImage: `url(${constants.imageUrl}/${card.resource[currentAnimation]})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: `${
                        ["MINION", "GENERAL"].includes(
                          card.cardType.toUpperCase()
                        )
                          ? "center 10%"
                          : "center"
                      }`,
                      backgroundSize: `${
                        ["MINION", "GENERAL"].includes(
                          card.cardType.toUpperCase()
                        )
                          ? "100%"
                          : "75%"
                      }`,
                    }}
                  ></div>
                  <span className="text-primary-cyan capitalize">
                    {currentAnimation} animation
                  </span>
                  <div
                    className="absolute rounded-full bg-primary-dark-blue border-2 border-secondary-dark-blue -right-5 top-1/2 -translate-y-1/2 p-2 active:scale-110 transition-all"
                    onClick={loadNextAnimation}
                  >
                    <FaArrowRight className="text-secondary-cyan" size={25} />
                  </div>
                  <div
                    className="absolute rounded-full bg-primary-dark-blue border-2 border-secondary-dark-blue -left-5 top-1/2 -translate-y-1/2 p-2 active:scale-110 transition-all"
                    onClick={loadPreviousAnimation}
                  >
                    <FaArrowLeft className="text-secondary-cyan" size={25} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex md:flex-row flex-col items-center text-2xl text-secondary-cyan gap-3">
                  <div className="flex flex-row items-center gap-2 ">
                    {card.cardType.toUpperCase() === "GENERAL" ? (
                      <FaKhanda />
                    ) : card.cardType.toUpperCase() === "MINION" ? (
                      <FaPaw />
                    ) : card.cardType.toUpperCase() === "SPELL" ? (
                      <FaFire />
                    ) : (
                      <FaRegHandRock />
                    )}
                    <span className="capitalize font-bold">
                      {card.cardType}
                    </span>
                  </div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full hidden md:block"></div>
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      className="overflow-hidden"
                      alt="Faction"
                      src={`/icons/factions/${Faction[card.faction]} rune.png`}
                      height={30}
                      width={30}
                    />
                    <span
                      style={{
                        color: getFactionColor(card.faction),
                      }}
                      className="capitalize"
                    >
                      {Faction[card.faction]}
                    </span>
                  </div>
                  <div className="h-1 w-1 bg-gray-500 rounded-full hidden md:inline"></div>
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      alt="Icon rarity"
                      src={`/icons/rarity/${card.rarity.toUpperCase()}.svg`}
                      height={30}
                      width={30}
                    />
                    <span className="capitalize">{card.rarity}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center md:justify-start justify-center text-2xl text-secondary-cyan gap-3">
                  <div className="flex flex-row items-center gap-2">
                    <BsFillHexagonFill className="text-primary-light-blue" />
                    <span className="capitalize">{card.mana} Mana</span>
                    <div className="h-1 w-1 bg-gray-500 rounded-full hidden md:inline"></div>
                  </div>
                  {card.attack && (
                    <>
                      <div className="flex flex-row items-center gap-2">
                        <TbSword className="text-attack-icon" />
                        <span className="capitalize">{card.attack} Attack</span>
                      </div>
                      <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                    </>
                  )}
                  {card.health && (
                    <div className="flex flex-row items-center gap-2">
                      <BsHeartFill className="text-red-500" />
                      <span className="capitalize">{card.health} Health</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col text-secondary-cyan gap-3">
                  <span
                    className="text-xl text-wrap w-2/3"
                    dangerouslySetInnerHTML={{
                      __html: HighlightKeywords(card.description),
                    }}
                  ></span>
                  {Keywords.filter((keyword) =>
                    card.description.toLowerCase().includes(keyword)
                  ).map((kw: string, key) => (
                    <span key={key} className="text-md">
                      <div className="text-white font-bold text-xl inline capitalize">
                        {kw}
                        {": "}
                      </div>
                      {/* @ts-ignore */}
                      {KeywordDescription[kw.replace(" ", "_")]}
                    </span>
                  ))}
                  {!!card.relatedCards.length && (
                    <>
                      <hr className="border-secondary-cyan my-1" />
                      <span className="text-2xl font-bold">Related Cards</span>
                      <div className="flex flex-col">
                        {card.relatedCards.map((id, i) => (
                          <Link
                            className="cursor-pointer hover:scale-110"
                            key={i}
                            href={`/card/${id}`}
                          >
                            <span className="text-white font-bold text-xl hover:opacity-75 transition-all cursor-pointer">
                              {cardDataById[id]?.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default CardView
