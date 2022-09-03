import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { useDeckContext } from "../context/newDeckContext"
import { Faction } from "../data/cards"
import { trpc } from "../utils/trpc"
import Modal from "./Common/Modal"
import Loading from "./Loading"

const SaveDeckModal: React.FC<{
  show: boolean
  setShow: (b: boolean) => void
  name: string
  setName: (name: string) => void
}> = ({ show, setShow, name, setName }) => {
  const [isPrivate, setIsPrivate] = useState(false)
  const [localDescription, setLocalDescription] = useState("")
  const { saveDeck, general, minionCount, spellCount, artifactCount, cards } =
    useDeckContext()

  const { data: session } = useSession()
  const router = useRouter()

  const { mutateAsync: saveDeckMutation, isLoading } = trpc.useMutation([
    "decksave",
  ])

  const handleSave = async () => {
    if (!general) return
    const Swal = (await import("sweetalert2")).default
    if (!name || name.length > 30) {
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

    if (localDescription.length >= 250)
      return Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Invalid description",
        text: "Your deck description is too long (Max 150 characters.)",
        timer: 2000,
        position: "bottom-right",
        showConfirmButton: false,
      })

    const code = saveDeck()
    if (!code) return
    const result = await saveDeckMutation({
      creatorId: session?.user.id ?? null,
      generalId: general.id,
      description: localDescription,
      deckName: name,
      code,
      minionCount,
      faction: general.faction,
      spellCount,
      artifactCount,
      isPrivate,
      factionCardCount: cards.reduce(
        (acc, c) => acc + (c.faction === general.faction ? c.count : 0),
        0
      ),
      neutralCardCount: cards.reduce(
        (acc, c) => acc + (c.faction === Faction.neutral ? c.count : 0),
        0
      ),
    })
    if (result) router.push(`/deck/${result.id}`)
  }

  return (
    <Modal show={show} setShow={setShow} title="Save Deck">
      {isLoading && <Loading />}
      <label className="cursor-pointer" htmlFor="deckName">
        Deck Name
      </label>
      <input
        name="deckName"
        maxLength={20}
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Deck Name"
        className="w-full border-[1px] border-faint bg-transparent rounded-md py-1 px-2 min-h-full self-center text-white my-2"
      />
      <label className="cursor-pointer" htmlFor="deck-description">
        Deck Description
      </label>
      <textarea
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
        placeholder="Write a short description of your deck"
        className="resize-none bg-transparent border-[1px] border-faint rounded-md py-1 px-2 my-2"
        name="deck-description"
        cols={50}
        rows={10}
      ></textarea>
      {session && session.user.id && (
        <div className="flex flex-row items-end justify-start gap-2">
          <label className="cursor-pointer" htmlFor="isPrivate">
            Save as a private deck?
          </label>
          <input
            checked={isPrivate}
            onChange={(e) => setIsPrivate(!isPrivate)}
            type="checkbox"
            className="rounded-md self-center cursor-pointer "
          />
        </div>
      )}
      <div className="border-t-[1px] border-t-faint my-3 flex flex-col"></div>
      <div className="flex flex-row justify-center">
        <button
          onClick={handleSave}
          className="bg-vetruvian text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer uppercase disabled:opacity-50"
        >
          Save Deck
        </button>
      </div>
    </Modal>
  )
}

export default SaveDeckModal
