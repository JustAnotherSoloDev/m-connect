import styles from "./App.module.scss"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Session } from "./Routes/Session/Session"
import { Join } from "./Routes/Join/Join"
import { Home } from "./Routes/Home/Home"
import { WaitingArea } from "./Routes/Waiting/Waiting"
import { initializePeerConnection } from "./Connection/Connection"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/session",
    Component: Session,

  },
  {
    path: "/join",
    Component: Join

  },
  {
    path: "/wait",
    Component: WaitingArea
  }
])
function App() {
  return (
    <RouterProvider router={router} />
  )
}



initializePeerConnection()

export default App

