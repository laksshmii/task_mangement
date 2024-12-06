const express = require('express');
const { getAllTasks, createTask, updateTask,deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/get', getAllTasks);
router.post('/add', createTask);
router.put('/update/:id', updateTask);
router.delete('delete/:id', deleteTask);

module.exports = router;
