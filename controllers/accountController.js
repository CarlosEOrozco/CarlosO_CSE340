const utilities = require("../utilities/")


/* ****************************************
*  Deliver login view
* *************************************** */
const accountController = {
    buildLogin: async function(req, res, next) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        title: "Login",
        nav,
        message: req.flash('message') || null
      })
    }
  }

module.exports = accountController;