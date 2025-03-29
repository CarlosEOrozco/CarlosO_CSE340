const { body, validationResult } = require('express-validator');
const validate = {};

/* ***************************
 * Classification Validation Rules
 * ************************** */
validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .notEmpty()
      .withMessage('Classification name is required')
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage('No spaces or special characters allowed')
  ];
};

/* ***************************
 * Inventory Validation Rules
 * ************************** */
validate.inventoryRules = () => {
  return [
    body('classification_id')
      .notEmpty()
      .withMessage('Classification is required'),
    
    body('inv_make')
      .trim()
      .notEmpty()
      .withMessage('Make is required')
      .isLength({ min: 3 })
      .withMessage('Make must be at least 3 characters'),
    
    body('inv_model')
      .trim()
      .notEmpty()
      .withMessage('Model is required')
      .isLength({ min: 3 })
      .withMessage('Model must be at least 3 characters'),
    
    body('inv_year')
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage('Please enter a valid year'),
    
    body('inv_description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('inv_miles')
      .isInt({ min: 0 })
      .withMessage('Miles must be a positive number'),
    
    body('inv_color')
      .trim()
      .notEmpty()
      .withMessage('Color is required')
  ];
};

/* ***************************
 * Check classification data
 * ************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name,
      message: null
    });
  }
  next();
};

/* ***************************
 * Check inventory data
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    return res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
      message: null
    });
  }
  next();
};

module.exports = validate;