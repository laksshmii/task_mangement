const express = require('express');
const { getAllTasks, createTask, getTasksByAssignedTo, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/get', getAllTasks);
router.post('/add', createTask);
router.put('/update/:id', updateTask);
router.delete('delete/:id', deleteTask);
router.get('/assigned/:assignedTo', getTasksByAssignedTo);


router.put('/status/:id', updateTaskStatus);

module.exports = router;
