const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

const accountController = {
  /* ***************************
  *  Deliver login view
  * ************************** */
  buildLogin: async function(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash('message') || null
    });
  },

  /* ****************************************
  *  Deliver registration view
  * *************************************** */
  buildRegister: async function(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      message: req.flash('message') || null
    });
  },

  /* ****************************************
  *  Process Registration
  * *************************************** */
  registerAccount: async function(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password // Storing plain text password (temporarily)
    );

    if (regResult.rowCount === 1) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  }
};

module.exports = accountController;