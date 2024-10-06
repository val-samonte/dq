import { SideBar } from "./SideBar"

function App() {
  return (<div className='absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden'>
    <div className="flex flex-col h-full">
      <SideBar />
    </div>
  </div>)
}

export default App
