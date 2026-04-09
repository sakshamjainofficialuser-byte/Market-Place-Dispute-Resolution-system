import { Route, Routes } from "react-router-dom"
import Homepage from "../Pages/Homepage"
import LoginRegister from "../Components/LoginRegister"
import Register from "../Components/Register"

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginRegister/>}></Route>
        <Route path="/homepage" element={<Homepage/>}></Route>
      </Routes>
    </>
  )
}

// 69cedfb339a7f19f6bf97ccb
export default App
