const express = require("express");
const homepageRoute = express.Router();
const userHomepage = require('../controllers/userhomepage.controller')


homepageRoute.get("/users",userHomepage)

module.exports = homepageRoute;