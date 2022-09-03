import { useState } from "react"
import { BiExport } from "react-icons/bi"

const CopyDeckCode: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyDeckCode = async () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <button
      disabled={copied}
      onClick={handleCopyDeckCode}
      className={`text-white rounded-sm px-4 py-1 hover:opacity-80 cursor-pointer capitalize transition-all flex flex-row items-center gap-1 ${
        copied ? "bg-green-600" : "disabled:opacity-50 bg-vetruvian"
      }`}
    >
      {copied ? (
        "Copied!"
      ) : (
        <>
          {" "}
          <BiExport className="text-[#f1f1f1]" />
          Copy Deck Code
        </>
      )}
    </button>
  )
}

export default CopyDeckCode
