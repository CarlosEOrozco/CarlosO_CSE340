// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:invId", Util.handleErrors(invController.buildByInventoryId));

// Intentional 500 error route
router.get("/trigger-error", Util.handleErrors(invController.triggerError));

module.exports = router;