const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");

// Login route
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Registration route
router.get("/register", Util.handleErrors(accountController.buildRegister));

module.exports = router;