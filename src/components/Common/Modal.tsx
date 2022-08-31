import { useRef } from "react"

const Modal: React.FC<{
  show: boolean
  setShow: (b: boolean) => void
  children: React.ReactNode
  title?: string
}> = ({ children, show, setShow, title }) => {
  const boxRef = useRef<HTMLDivElement>(null)

  if (!show) return null

  return (
    <div
      onClick={(e) => {
        if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
          setShow(false)
        }
      }}
      className="fixed z-200 w-screen h-screen inset-0 bg-black bg-opacity-60"
    >
      <div
        ref={boxRef}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white rounded-md px-8 py-6 space-y-5 bg-primary-dark-blue shadow-lg"
      >
        {!!title && (
          <h1 className="text-2xl text-center font-semibold">{title}</h1>
        )}
        <div className="py-5 border-t border-faint flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
