import Logo from "../../public/icons/Logo.png"
import Image from "next/image"
import Link from "next/link"
import navigation from "../data/navigation"

const Sidebar: React.FC = () => {
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
            className="text-white text-2xl font-bold cursor-pointer transition-all hover:text-blue-700 px-10"
          >
            <Link href={n.href}>{n.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
