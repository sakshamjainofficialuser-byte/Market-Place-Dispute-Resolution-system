import { useState } from "react"

function LoginPage() {

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    return (
        <form>
            <label htmlFor="username">Enter Username:</label>
            <input type='text' placeholder="Enter Username" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <br></br>
            <label htmlFor="password">Enter Password:</label>
            <input type="password" placeholder="Enter Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br/>
            <button>Log In</button>
        </form>
    )
}

export default LoginPage