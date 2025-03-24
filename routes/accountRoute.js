const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");

// GET Routes
router.get("/login", Util.handleErrors(accountController.buildLogin));
router.get("/register", Util.handleErrors(accountController.buildRegister));

// POST Route for registration form submission
/* ****************************************
*  Process registration request
* *************************************** */
router.post("/register", 
  Util.handleErrors(accountController.registerAccount)
);

module.exports = router;