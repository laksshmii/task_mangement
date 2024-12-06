const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || '80dd832b9fa2db',
        pass: process.env.SMTP_PASS || '175b658f115095',
      },
    });

    const mailOptions = {
      from: 'poomalavenkat@gmail.com',
      to: newEmployee.email,
      subject: 'Welcome to the Company',
      text: `Hello ${newEmployee.name},\n\nYour account has been created successfully. Here are your login details:\n\nEmail: ${newEmployee.email}\nPassword: ${password}\n\nBest regards,\nYour Company Name`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(201).json({
      message: 'Employee added successfully',
      employee: {
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
      },
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getEmployee = async (req, res) => {

  try {
    const employee = await Employee.findAll();

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Error fetching employee data' });
  }
};
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Error deleting employee' });
  }
};
exports.updateEmployee = async (req, res) => {
  const { id } = req.params; // Extract `id` from request parameters
  const { name, email, role } = req.body; // Extract other fields from request body

  try {
    // Find the employee by ID
    const employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      // If the employee does not exist, send a 404 response
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update fields if provided, otherwise retain existing values
    employee.name = name ?? employee.name;
    employee.email = email ?? employee.email;
    employee.role = role ?? employee.role;

    // Save changes to the database
    await employee.save();

    // Respond with a success message and updated employee data
    res.json({
      message: 'Employee updated successfully',
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    // Handle unexpected errors
    res.status(500).json({ error: 'Error updating employee' });
  }
};


