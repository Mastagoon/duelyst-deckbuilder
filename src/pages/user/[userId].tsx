import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Loading from "../../components/Loading"
import PageLayout from "../../components/PageLayout"
import { trpc } from "../../utils/trpc"
import DeckDisplay from "../../components/Deck/DeckDisplay"
import { useEffect, useRef, useState } from "react"
import { FaEdit, FaSave } from "react-icons/fa"
import MetaData from "../../components/MetaData"

const UserProfilePage: NextPage = () => {
  const [userName, setUsername] = useState<string>()
  const [editUsername, setEditUsername] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const { userId } = router.query

  const { data: user, isLoading } = trpc.useQuery([
    "usergetById",
    { id: (userId as string) ?? "" },
  ])
  const { mutate: updateUserMutation } = trpc.useMutation("userupdate")

  const myProfile = session?.user.id === userId

  if (!isLoading && !user) router.push("/")

  const handleEditUsername = async () => {
    if (editUsername) {
      // save
      updateUserMutation({ name: userName })
      const Swal = (await import("sweetalert2")).default
      Swal.fire({
        customClass: {
          popup: "alert-dialog",
        },
        title: "Updated",
        text: "Username updated successfuly",
        timer: 2000,
        showConfirmButton: false,
        position: "bottom-right",
      })
    }
    setEditUsername(!editUsername)
  }

  useEffect(() => {
    if (editUsername && inputRef.current) inputRef.current.focus()
  }, [editUsername])

  return (
    <>
      <MetaData title={user?.name ?? ""} />
      <PageLayout>
        {isLoading && <Loading />}
        {!!user && (
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-center my-5 text-faint">
              <div className="flex flex-col items-center gap-2">
                {/* #TODO add default image */}
                <div>
                  <img className={"rounded-full"} src={user?.image ?? ""} />
                </div>
                <div className="flex flex-row items-center gap-2 relative">
                  <input
                    ref={inputRef}
                    disabled={!editUsername}
                    className={`text-xl bg-transparent font-bold text-center cursor-pointer outline-none p-0 m-0 ${
                      editUsername && "border-faint"
                    }`}
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    defaultValue={user.name ?? ""}
                  />
                  {myProfile && (
                    <div className="absolute right-8">
                      {editUsername ? (
                        <FaSave
                          onClick={handleEditUsername}
                          className="text-faint hover:scale-150 transition-all cursor-pointer hover:text-white"
                        />
                      ) : (
                        <FaEdit
                          onClick={handleEditUsername}
                          className="text-faint hover:scale-150 transition-all cursor-pointer hover:text-white"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr className="mx-16 text-faint border-faint" />
            <h1 className="font-bold text-faint mx-16 my-3 text-center">
              {myProfile ? "Your" : `${user.name}'s`} Recent Decks
            </h1>
            <div className="flex flex-row flex-wrap justify-center">
              {user.decks.map((deck, i) => (
                <DeckDisplay key={i} deck={{ ...deck, creator: user }} />
              ))}
            </div>
          </div>
        )}
      </PageLayout>
    </>
  )
}

export default UserProfilePage
