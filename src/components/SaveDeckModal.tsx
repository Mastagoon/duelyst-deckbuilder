import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import { useDeckContext } from "../context/newDeckContext"
import { trpc } from "../utils/trpc"
import Modal from "./Common/Modal"
import Loading from "./Loading"

const SaveDeckModal: React.FC<{
  show: boolean
  setShow: (b: boolean) => void
  name?: string
}> = ({ show, setShow, name = "New Deck" }) => {
  const [isPrivate, setIsPrivate] = useState(false)
  const [localDescription, setLocalDescription] = useState("")
  const [localDeckName, setLocalDeckName] = useState(name)
  const {
    deckName,
    updateDeckDescription,
    deckDescription,
    updateDeckName,
    saveDeck,
    general,
    minionCount,
    spellCount,
    artifactCount,
  } = useDeckContext()

  const { data: session } = useSession()
  const router = useRouter()

  const { mutateAsync: saveDeckMutation, isLoading } = trpc.useMutation([
    "decksave",
  ])

  const handleSave = async () => {
    if (!session || !session.user.id || !general) return
    const Swal = (await import("sweetalert2")).default
    if (!localDeckName || localDeckName.length > 30) {
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
    const code = saveDeck()
    if (!code) return
    const result = await saveDeckMutation({
      creatorId: session.user.id,
      generalId: general.id,
      description: localDescription,
      deckName: localDeckName,
      code,
      minionCount,
      faction: general.faction,
      spellCount,
      artifactCount,
      isPrivate,
    })
    router.push(`/deck/${result.id}`)
  }

  return (
    <Modal show={show} setShow={setShow} title="Save Deck">
      {isLoading && <Loading />}
      <label className="cursor-pointer" htmlFor="deckName">
        Deck Name
      </label>
      <input
        name="deckName"
        onChange={(e) => setLocalDeckName(e.target.value)}
        value={localDeckName}
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
