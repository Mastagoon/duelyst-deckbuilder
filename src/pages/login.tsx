import PageLayout from "../components/PageLayout"
import Image from "next/image"
import { FaDiscord, FaGoogle } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { getCsrfToken, getProviders, getSession, signIn } from "next-auth/react"
import { Provider } from "next-auth/providers"
import { GetServerSideProps } from "next"
import Link from "next/link"

const getProviderLogo = (provider: string) => {
  switch (provider) {
    case "google":
      return <FaGoogle />
    case "discord":
      return <FaDiscord />
  }
}

const getProviderColor = (provider: string) => {
  switch (provider) {
    case "google":
      return "#DB4437"
    case "discord":
      return "#7289da"
  }
}

const LoginPage: React.FC<{ providers: Provider[]; csrfToken: string }> = ({
  providers,
  csrfToken,
}) => {
  return (
    <PageLayout>
      <div className="flex flex-col justify-center h-full items-center -translate-y-10">
        <Image
          alt="Healing Mystic"
          height={90}
          width={90}
          src={`/card_sprites/11245.png`}
        />
        <div className="text-white w-1/4 text-center">
          <span className="text-3xl font-bold">Sign In</span>
          {Object.values(providers).map((provider) => (
            <div
              style={{
                backgroundColor: getProviderColor(provider.name.toLowerCase()),
              }}
              className="flex flex-row justify-center items-center rounded-md my-2 cursor-pointer hover:opacity-80"
              key={provider.name}
            >
              <div className="ml-4">
                {getProviderLogo(provider.name.toLowerCase())}
              </div>
              <button
                className="w-full py-2 px-5 uppercase font-bold tracking-wide cursor-pointer"
                onClick={() => signIn(provider.id)}
              >
                {provider.name}
              </button>
            </div>
          ))}
          <div className="flex flex-row gap-2 items-center text-faint">
            <div className="border-b-[1px] border-faint flex-1"></div>
            <span className="text-xl">or</span>
            <div className="border-b-[1px] border-faint flex-1"></div>
          </div>
          <form method="post" action="/api/auth/signin/email">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="flex flex-row justify-center items-center rounded-md my-2 cursor-pointer bg-[#e1e1e1] ">
              <div className="ml-4">
                {" "}
                <MdEmail className="text-black" />
              </div>
              <input
                className="w-full px-5 py-2 bg-[#e1e1e1] text-black outline-none"
                placeholder="Email Address"
              />
            </div>
            <button
              className="bg-primary-light-purple px-4 hover:opacity-80 cursor-pointer w-full rounded-md py-2 font-bold"
              type="submit"
            >
              Sign in with Email
            </button>
          </form>
          <hr className="my-3" />
          <div className="flex flex-col gap-2">
            <Link href="/reset-password">
              <span className="cursor-pointer text-vetruvian">
                Forgot your password?
              </span>
            </Link>
            <span className="text-faint">
              Donapos&;t have an account?{" "}
              <Link href="/register">
                <span className="text-vetruvian cursor-pointer">Sign Up</span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (session)
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    }
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(ctx)
  return {
    props: { providers, csrfToken },
  }
}

export default LoginPage
