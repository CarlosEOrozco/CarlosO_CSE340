const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {
  /* ***************************
   *  Deliver login view
   * ************************** */
  buildLogin: async function (req, res, next) {
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
  buildRegister: async function (req, res, next) {
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
  registerAccount: async function (req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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
   *  Process Login (JWT-based)
   * *************************************** */
  accountLogin: async function (req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
      return;
    }

    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password;
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

        if (process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
        }

        return res.redirect("/account/");
      } else {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        });
      }
    } catch (error) {
      throw new Error('Access Forbidden');
    }
  }
};

module.exports = accountController;