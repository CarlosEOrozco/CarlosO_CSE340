// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation");
const Util = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:invId", Util.handleErrors(invController.buildByInventoryId));

// Intentional 500 error route
router.get("/trigger-error", Util.handleErrors(invController.triggerError));

// Management routes
router.get("/", Util.handleErrors(invController.buildManagement));
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));
router.get("/add-inventory", Util.handleErrors(invController.buildAddInventory));

// Process forms
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  Util.handleErrors(invController.addClassification)
);

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  Util.handleErrors(invController.addInventory)
);

// Keep your existing routes
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", Util.handleErrors(invController.buildByInventoryId));
router.get("/trigger-error", Util.handleErrors(invController.triggerError));

module.exports = router;