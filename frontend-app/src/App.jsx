import { Route, Routes } from "react-router-dom"
import Homepage from "../Pages/Homepage"
import LoginRegister from './components/LoginRegister/LoginRegister'

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage/>}></Route>
      </Routes>
      <div>
        <LoginRegister/>
      </div>
    </>
  )
}

export default App;