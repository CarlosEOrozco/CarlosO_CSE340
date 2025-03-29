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
      errors: null,
      message: req.flash('notice') || null,
      account_email: req.flash('account_email') || ''
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
      message: req.flash('notice') || null
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
      account_password
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
  },

  /* ****************************************
  *  Process Login
  * *************************************** */
  accountLogin: async function(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    
    try {
      const accountData = await accountModel.getAccountByEmail(account_email);
      
      if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        req.flash("account_email", account_email);
        return res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email
        });
      }

      // Compare passwords (you'll need to implement this utility)
      const passwordMatch = await utilities.comparePasswords(
        account_password,
        accountData.account_password
      );

      if (passwordMatch) {
        // Set up session
        req.session.account = {
          id: accountData.account_id,
          firstname: accountData.account_firstname,
          lastname: accountData.account_lastname,
          email: accountData.account_email
        };
        
        req.flash("notice", `Welcome back ${accountData.account_firstname}!`);
        return res.redirect("/account/");
      } else {
        req.flash("notice", "Please check your credentials and try again.");
        req.flash("account_email", account_email);
        return res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email
        });
      }
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing your login.");
      return res.status(500).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email
      });
    }
  }
};

module.exports = accountController;