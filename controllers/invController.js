const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

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
    next(error);
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
    next(error);
  }
};

/* ***************************
 * Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      message: req.flash('notice') || null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      message: req.flash('notice') || null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  let nav = await utilities.getNav();
  
  try {
    const result = await invModel.addClassification(classification_name);
    if (result.rowCount > 0) {
      nav = await utilities.getNav();
      req.flash('notice', 'Classification added successfully!');
      return res.redirect('/inv/');
    } else {
      req.flash('notice', 'Failed to add classification.');
      return res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
        message: req.flash('notice')
      });
    }
  } catch (error) {
    req.flash('notice', 'Error adding classification.');
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
      message: req.flash('notice')
    });
  }
};

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      message: req.flash('notice') || null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process new inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  let nav = await utilities.getNav();
  
  try {
    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    if (result.rowCount > 0) {
      req.flash('notice', 'Vehicle added successfully!');
      return res.redirect('/inv/');
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id);
      req.flash('notice', 'Failed to add vehicle.');
      return res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        ...req.body,
        message: req.flash('notice')
      });
    }
  } catch (error) {
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash('notice', 'Error adding vehicle.');
    return res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      ...req.body,
      message: req.flash('notice')
    });
  }
};

// Intentional 500 error function
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 Error: Something went wrong!");
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont;