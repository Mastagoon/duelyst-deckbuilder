import Sidebar from "./Sidebar"

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex lg:flex-row flex-col h-full flex-wrap">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default PageLayout
