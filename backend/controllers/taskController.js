const Task = require('../models/Task');
const Employee = require('../models/Employee');  // Assuming you have an Employee model

exports.createTask = async (req, res) => {
  const { title, description, dueDate, status, assignedTo } = req.body;

  try {
    // Ensure the assigned employee exists
    const employee = await Employee.findByPk(assignedTo);
    if (!employee) {
      return res.status(400).json({ error: 'Assigned employee not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      assignedTo,  // Store the assigned employee's ID
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status, assignedTo } = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task || task.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ensure the assigned employee exists
    if (assignedTo) {
      const employee = await Employee.findByPk(assignedTo);
      if (!employee) {
        return res.status(400).json({ error: 'Assigned employee not found' });
      }
      task.assignedTo = assignedTo;  // Update assigned employee
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    await task.save();

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};
exports.getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks, including the assigned employee data
    const tasks = await Task.findAll({
      include: [
        {
          model: User,  // Include the User (employee) data
          as: 'assignee', // Alias for the assigned employee
          attributes: ['id', 'name', 'email'],  // Specify which fields to include from User
        },
      ],
    });

    // Return the tasks data along with the assigned employee information
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};