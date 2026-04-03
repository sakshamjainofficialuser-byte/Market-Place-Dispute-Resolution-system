const userDataModel = require("../models/userData.model") 

async function register(req,res) {

    const userdata = req.body 

    const isUserExist = await userDataModel.findOne(
    {$or: [ 
        {username: userdata.name},
        {email: userdata.email}
    ]}) 

    if (isUserExist) {
        return res.status(409).send({ message: "User already exist" }) // ← add return
    } 
    
    const user = await userDataModel.create({
        username: userdata.name,
        email: userdata.email,
        password: userdata.password,
        role: userdata.role
    })

    if (user) {
        res.send("user created successfully")
        console.log(user)
        }
}
    
module.exports = {register} 