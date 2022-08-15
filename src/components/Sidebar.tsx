import Logo from "../../public/icons/Logo.png"
import Image from "next/image"
import Link from "next/link"
import navigation from "../data/navigation"
import { useRouter } from "next/router"

const Sidebar: React.FC = () => {
  const router = useRouter()

  const path = router.pathname
  console.log(path)

  return (
    <div className="fixed top-0 bg-primary-dark-blue h-screen w-60 shadow-lg text-white text-center flex flex-col items-center py-5">
      {/*Logo*/}
      <Image src={Logo} />
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
  )
}

export default Sidebar
