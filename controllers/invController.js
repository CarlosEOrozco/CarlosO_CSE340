const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

/* ***************************
 * Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryById(inv_id);
    const detailHTML = await utilities.buildInventoryDetail(data);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: data.inv_make + " " + data.inv_model,
      nav,
      detailHTML,
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

// Intentional 500 error function
invCont.triggerError = async function (req, res, next) {
  // Intentionally throw an error
  throw new Error("Intentional 500 Error: Something went wrong!");
};

module.exports = invCont