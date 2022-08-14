import Sidebar from "./Sidebar"

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <Sidebar />
      </div>

      <div className="col-span-10">{children}</div>
    </div>
  )
}

export default PageLayout
