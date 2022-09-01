import Sidebar from "./Sidebar"

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex xl:flex-row flex-col h-full flex-wrap">
      <div className="xl:fixed xl:w-[286px]">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-scroll xl:ml-[286px]">{children}</div>
    </div>
  )
}

export default PageLayout
