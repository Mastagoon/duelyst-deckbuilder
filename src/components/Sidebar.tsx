import Logo from "../../public/icons/Logo.png"
import Image from "next/image"
import Link from "next/link"
import navigation from "../data/navigation"
import { useRouter } from "next/router"
import { useRef } from "react"

const Sidebar: React.FC = () => {
  const router = useRouter()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    mobileMenuRef.current?.classList.toggle("hidden")
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className="top-0 w-full bg-secondary-dark-blue flex flex-col lg:hidden relative">
        {/* Hamburger menu */}
        <div className="flex flex-row w-full items-center justify-between px-4 py-2">
          <button
            onClick={toggleMobileMenu}
            className="outline-none mobile-menu-button"
          >
            <svg
              className=" w-12 h-12 text-gray-500 hover:text-green-500 "
              x-show="!showMenu"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <div className="grow flex justify-center scale-75">
            <Image alt="Logo" src={Logo} />
          </div>
        </div>
        {/* mobile menu */}

        <div
          ref={mobileMenuRef}
          className="hidden lg:hidden mobile-menu left-0 py-3 animate-slideInFromTop w-screen bg-primary-dark-blue"
        >
          <ul className="text-start flex flex-col gap-5 w-full justify-around h-full">
            {navigation.map((n, i) => (
              <li
                key={i}
                className={`text-white text-2xl font-bold cursor-pointer transition-all  px-10 ${
                  router.pathname === n.path
                    ? "text-primary-light-blue border-l-2 border-primary-light-blue"
                    : "hover:text-primary-light-blue hover:border-l-2 border-primary-light-blue"
                }`}
              >
                <Link href={n.path}>{n.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Normal sidebar */}
      <div className="top-0 bg-primary-dark-blue h-screen shadow-lg text-white text-center flex flex-col items-center py-5 hidden lg:block">
        {/*Logo*/}
        <Image alt="Logo" src={Logo} />
        <hr className="w-full p-2 my-3" />
        {/*Menu*/}
        <ul className="text-start flex flex-col gap-5 w-full">
          {navigation.map((n, i) => (
            <li
              key={i}
              className={`text-white text-2xl font-bold cursor-pointer transition-all  px-10 ${
                router.pathname === n.path
                  ? "text-primary-light-blue border-l-2 border-primary-light-blue"
                  : "hover:text-primary-light-blue hover:border-l-2 border-primary-light-blue"
              }`}
            >
              <Link href={n.path}>{n.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Sidebar
