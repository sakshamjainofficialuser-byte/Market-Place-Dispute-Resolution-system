
const app = require("./src/app")
const express = require("express")
const loginRoute = require("./src/routes/login")

app.use(express.json())
app.use("/login",loginRoute)

console.log("Hii")

app.listen(3000,() => {
    console.log("Server startes running port 3000")
})