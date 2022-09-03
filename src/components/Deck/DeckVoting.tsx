import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { trpc } from "../../utils/trpc"

const DeckVoting: React.FC<{
  totalVotes: number
  vote: number
  deckId: string
}> = ({ vote, totalVotes, deckId }) => {
  const { mutateAsync: deckVoteMutation } = trpc.useMutation(["deckvote"])
  const router = useRouter()
  const { data: session } = useSession()
  const [isPositive, setIsPositive] = useState(vote > 0)

  const handleUpvote = async () => {
    if (!deckId || vote > 0) return
    if (!session || !session.user.id) {
      const Swal = (await import("sweetalert2")).default
      const response = await Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Not Logged In",
        text: "You must be logged in to vote for a deck",
        confirmButtonText: "Login",
        denyButtonText: "Cancel",
        showDenyButton: true,
      })
      if (response.isConfirmed) {
        router.push("/login?callback=/deck?id=" + deckId)
      }
      return
    }
    setIsPositive(true)
    await deckVoteMutation({
      deckId,
      userId: session?.user.id,
      vote: "1",
    })
  }

  const handleDownvote = async () => {
    if (vote < 0) return
    if (!session || !session.user.id) {
      const Swal = (await import("sweetalert2")).default
      const response = await Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Not Logged In",
        text: "You must be logged in to vote for a deck",
        confirmButtonText: "Login",
        denyButtonText: "Cancel",
        showDenyButton: true,
      })
      if (response.isConfirmed) {
        router.push("/login?callback=/deck?id=" + deckId)
      }
      return
    }
    setIsPositive(false)
    await deckVoteMutation({
      deckId: deckId,
      userId: session?.user.id,
      vote: "-1",
    })
  }

  return (
    <div className="flex flex-col items-center justify-center text-center text-primary-cyan">
      <FaArrowUp
        onClick={handleUpvote}
        className={`hover:scale-110 cursor-pointer ${
          isPositive && "text-green-300"
        }`}
      />
      <span className="text-lg font-bold my-1">{totalVotes}</span>
      <FaArrowDown
        onClick={handleDownvote}
        className={`hover:scale-110 cursor-pointer ${
          !isPositive && "text-red-300"
        }`}
      />
    </div>
  )
}

export default DeckVoting
