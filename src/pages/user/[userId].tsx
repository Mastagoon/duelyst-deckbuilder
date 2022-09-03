import { NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import Loading from "../../components/Loading"
import PageLayout from "../../components/PageLayout"
import { trpc } from "../../utils/trpc"
import DeckDisplay from "../../components/Deck/DeckDisplay"

const UserProfilePage: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { userId } = router.query

  const { data: user, isLoading } = trpc.useQuery([
    "usergetById",
    { id: (userId as string) ?? "" },
  ])

  const myProfile = session?.user.id === userId

  if (!isLoading && !user) router.push("/")

  return (
    <>
      <Head>
        <title>User {user?.name ?? ""}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                <h1 className="text-xl font-bold">{user.name}</h1>
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
