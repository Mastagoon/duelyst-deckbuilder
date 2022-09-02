import { Deck, DeckVote, User } from "@prisma/client"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Image from "next/image"
import Link from "next/link"
import { FaArrowUp, FaFire, FaPaw } from "react-icons/fa"
import { GiLunarWand } from "react-icons/gi"
import { Faction } from "../../data/cards"
import getFactionColor from "../../utils/getFactionColor"
import timePassedFormat from "../../utils/timePassedFormat"
import { BsClockHistory } from "react-icons/bs"
import { useSession } from "next-auth/react"
import { trpc } from "../../utils/trpc"

const DeckDisplay: React.FC<{
  deck: Deck & { creator: User; totalVotes: number }
}> = ({ deck }) => {
  const { data: session } = useSession()

  const { mutate: mutateUpdateDeck } = trpc.useMutation("deckupdate")

  const handleToggleVisiblity = (e: any) => {
    e.preventDefault()
    mutateUpdateDeck({ ...deck, isPrivate: !deck.isPrivate })
    deck.isPrivate = !deck.isPrivate
  }

  return (
    <Link href={`/deck/${deck.id}`}>
      <div
        style={{
          border: `1px solid ${getFactionColor(deck.faction)}`,
        }}
        className="card-border cursor-pointer transition-all m-5 relative flex flex-col rounded-md bg-primary-dark-blue select-none bg-no-repeat bg-cover py-2 hover:scale-110 duration-500 group h-[350px] w-[250px]"
      >
        <span className="text-white text-left text-lg font-bold px-2 truncate flex flex-row justify-between items-center">
          {deck.deckName}
          {session &&
            session.user?.id === deck.creatorId &&
            (deck.isPrivate ? (
              <AiOutlineEyeInvisible
                onClick={handleToggleVisiblity}
                className="text-faint hover:scale-150 transition-all hover:text-vetruvian"
              />
            ) : (
              <AiOutlineEye
                onClick={handleToggleVisiblity}
                className="text-faint hover:scale-150 transition-all hover:text-vetruvian"
              />
            ))}
        </span>
        <p className="text-faint text-left text-sm px-2 truncate break-all">
          {deck.description}
        </p>
        <div
          className="border-2 rounded-full p-0 m-auto"
          style={{
            borderColor: getFactionColor(deck.faction),
          }}
        >
          <Image
            className="self-center"
            alt="general"
            src={`/icons/factions/${Faction[deck.faction]} rune.png`}
            height={65}
            width={65}
          />
        </div>
        <div className="flex flex-row justify-around w-full bg-secondary-dark-blue shadow-lg px-2 py-1">
          <span className="text-faint relative flex flex-col items-center">
            <FaPaw size={30} />
            <span className="">{deck.minionCount}</span>
          </span>
          <span className="text-faint relative flex flex-col items-center">
            <FaFire size={30} />
            <span className="">{deck.spellCount}</span>
          </span>
          <span className="text-faint relative flex flex-col items-center">
            <GiLunarWand size={30} />
            <span className="">{deck.artifactCount}</span>
          </span>
        </div>
        <div
          style={{
            borderTop: `1px solid ${getFactionColor(deck.faction)}`,
          }}
          className="my-2 border-t-[1px] border-faint card-border-top transition-all duration-500"
        ></div>
        <div className="flex flex-row justify-between px-2">
          <div className="flex flex-col">
            <span className="text-faint text-left text-sm">
              Created By{" "}
              <Link href={`/user/${deck?.creatorId}`}>
                <span className="text-primary-cyan hover:opacity-80 cursor-pointer truncate">
                  {deck?.creator?.name ?? "Guest"}
                </span>
              </Link>
            </span>
            <span className="text-faint self-start flex flex-row items-center gap-1">
              <BsClockHistory />
              {timePassedFormat(deck.createdAt)}
            </span>
          </div>
          {!!deck.totalVotes && (
            <div className="text-faint">
              <FaArrowUp className="opacity-60" />
              <span>{deck.totalVotes}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default DeckDisplay
