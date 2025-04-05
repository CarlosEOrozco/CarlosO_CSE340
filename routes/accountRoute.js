const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");
const regValidate = require('../utilities/account-validation');

// GET Routes
router.get("/login", Util.handleErrors(accountController.buildLogin));
router.get("/register", Util.handleErrors(accountController.buildRegister));
router.get("/", Util.handleErrors(accountController.buildAccountManagement));

// POST Route for registration form submission
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
);

module.exports = router;