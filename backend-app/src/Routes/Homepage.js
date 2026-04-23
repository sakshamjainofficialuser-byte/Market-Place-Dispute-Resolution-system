const express = require("express");
const homepageRoute = express.Router();
const {userHomepage} = require('../controllers/userhomepage.controller')
const {getProduct} = require('../controllers/userhomepage.controller')


homepageRoute.get("/users",userHomepage)
homepageRoute.get("/:id",getProduct)

module.exports = homepageRoute;