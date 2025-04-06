const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const regValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process new classification
router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClassification)
);

// Route to process new inventory
router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory)
);

// Route to get inventory as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ***************************
 * Route to build edit inventory view
 * ************************** */
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventory)
);

/* ***************************
 * Route to process inventory update
 * ************************** */
router.post(
  "/update",
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

module.exports = router;