const Task = require('../models/Task');
const Employee = require('../models/Employee');

exports.createTask = async (req, res) => {
  const { title, description, dueDate, status, assignedTo } = req.body;

  try {
    if (!title || !description || !dueDate || !status || !assignedTo) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const employee = await Employee.findByPk(assignedTo);
    if (!employee) {
      return res.status(400).json({ error: 'Assigned employee not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      assignedTo,
      userId: assignedTo,
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task', details: error.message });
  }
};


exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status, assignedTo } = req.body;

  try {
    const task = await Task.findByPk(id);

    if (!task || task.userId !== assignedTo) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    if (assignedTo) {
      const employee = await Employee.findByPk(assignedTo);
      if (!employee) {
        return res.status(400).json({ error: 'Assigned employee not found' });
      }
      task.assignedTo = assignedTo;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    await task.save();

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {

    const tasks = await Task.findAll();

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
};
