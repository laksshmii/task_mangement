const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Assuming sequelize is configured in db.js

// Define the User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure name is provided
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true, // Validate email format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure password is provided
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure role is provided
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields automatically
  tableName: 'users', // Specify table name explicitly if needed
});

module.exports = User;
