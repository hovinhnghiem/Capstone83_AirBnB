import {useRoutes} from "react-router-dom"
import {routes} from "./routes"

function App() {
  const routerElement = useRoutes(routes)
  return (
    <>
      {routerElement}
    </>
  )
}
export default App