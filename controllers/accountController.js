const utilities = require("../utilities/")

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
  }
};

module.exports = accountController;