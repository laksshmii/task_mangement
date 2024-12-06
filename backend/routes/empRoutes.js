const express = require('express');
const { body } = require('express-validator');
const { addEmployee, getEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');


const router = express.Router();

// Define route for adding an employee with validation
router.post(
  '/addEmployee',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').notEmpty().withMessage('role is required'),
  ],
  addEmployee
);
router.get('/getEmployee', getEmployee);

router.put(
  '/updateEmployee/:id',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('role').optional().notEmpty().withMessage('Role cannot be empty'),
  ],
  updateEmployee
);
router.delete('/deleteEmployee/:id', deleteEmployee);
module.exports = router;
