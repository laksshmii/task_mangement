const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, dueDate, status } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            dueDate,
            status,
            userId: req.user.id,
        });
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task || task.userId !== req.user.id) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.title = title;
        task.description = description;
        task.dueDate = dueDate;
        task.status = status;
        await task.save();

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task || task.userId !== req.user.id) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
};
exports.updateEmployee = async (req, res) => {
    const { email, name, role, password } = req.body;
  
    try {
      // Find employee by email
      const employee = await Employee.findOne({ where: { email } });
  
      // If employee not found, return 404 error
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Update employee data
      if (password) {
        // Hash the password if it is being updated
        employee.password = await bcrypt.hash(password, 10);
      }
      employee.name = name || employee.name;
      employee.role = role || employee.role;
  
      // Save updated employee record
      await employee.save();
  
      // Return the updated employee data
      res.json({
        message: 'Employee updated successfully',
        employee: {
          name: employee.name,
          email: employee.email,
          role: employee.role,
        },
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Error updating employee' });
    }
  };
exports.deleteEmployee = async (req, res) => {
  const { email } = req.params;

  try {
    // Find employee by email
    const employee = await Employee.findOne({ where: { email } });

    // If employee not found, return 404 error
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete employee record
    await employee.destroy();

    // Return success message
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Error deleting employee' });
  }
};
  