import { Faction } from "../../data/cards"
import Image from "next/image"
import constants from "../../data/constants"
import Swal from "sweetalert2"
import { useRef } from "react"

const ShareDeckOverlay: React.FC<{
  png: string
  show: boolean
  setShow: (b: boolean) => void
  id: string
  deckName: string
}> = ({ id, png, show, deckName, setShow }) => {
  const boxRef = useRef<HTMLDivElement>(null)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${constants.appUrl}/deck/${id}`)
    return Swal.fire({
      customClass: {
        popup: "alert-dialog",
      },
      title: "Copied!",
      timer: 2000,
      position: "bottom-right",
      showConfirmButton: false,
    })
  }

  const handleCopyImageUrl = () => {
    navigator.clipboard.writeText(png)
    return Swal.fire({
      customClass: {
        popup: "alert-dialog",
      },
      title: "Copied!",
      timer: 2000,
      position: "bottom-right",
      showConfirmButton: false,
    })
  }

  const handleDownloadImage = () => {
    const link = document.createElement("a")
    link.href = png
    link.setAttribute("download", `${deckName}.png`)
    document.body.appendChild(link)
    link.click()
  }

  if (!show) return <></>

  return (
    <div
      onClick={(e) => {
        if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
          setShow(false)
        }
      }}
      className="fixed w-screen h-screen flex flex-col top-0 left-0 z-[300] bg-[rgba(0,0,0,0.8)] justify-center items-center"
    >
      <div
        ref={boxRef}
        style={{
          width: 1024,
        }}
      >
        <span className="text-lg font-bold">
          Powered by{" "}
          <a
            rel="noreferrer"
            target={"_blank"}
            href="https://decklyst.vercel.app"
          >
            <span className="text-vetruvian">Decklyst</span>
          </a>
        </span>
        <Image src={png} width={1024} height={692} />
        <div className="flex flex-row items-center justify-around w-full gap-5">
          <button
            onClick={handleCopyUrl}
            className="bg-primary-light-purple py-2 px-6 hover:opacity-80 cursor-pointer w-full rounded-md font-bold"
          >
            Copy Deck Url
          </button>
          <button
            onClick={handleCopyImageUrl}
            className="bg-primary-light-purple px-6 py-2 hover:opacity-80 cursor-pointer w-full rounded-md font-bold"
          >
            Copy Image Url
          </button>
          <button
            onClick={handleDownloadImage}
            className="bg-primary-light-purple px-6 py-2 hover:opacity-80 cursor-pointer w-full rounded-md font-bold"
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareDeckOverlay
