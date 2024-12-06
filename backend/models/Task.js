const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./Employee');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed'),
    defaultValue: 'Pending',
  },
  assignedTo: {
    type: DataTypes.INTEGER,  // This stores the employee's ID
    allowNull: true,
  },
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

// Adding the association for assignedTo (linking to User/Employee)
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });

module.exports = Task;
