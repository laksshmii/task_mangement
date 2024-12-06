import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
  Input,
} from "reactstrap";
import axios from "axios";

const AddTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch tasks from API when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks/get");
        setTasks(response.data);
      } catch (error) {
        console.error("There was an error fetching tasks", error);
      }
    };
    fetchTasks();
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/getEmployee");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleAddModal = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      status: "",
    });
    setErrors({});
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleEditModal = () => {
    setErrors({});
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.assignedTo.trim())
      newErrors.assignedTo = "Assigned To is required.";
    if (!formData.dueDate.trim()) newErrors.dueDate = "Due date is required.";
    if (!formData.status.trim()) newErrors.status = "Status is required.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) return;

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // If token doesn't exist, you can handle the case (e.g., show an error or redirect)
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    try {
      // Include token in the request headers
      const response = await axios.post(
        "http://localhost:5000/api/tasks/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the headers
          },
        }
      );

      // Update tasks state with the newly added task
      setTasks([...tasks, response.data]);
      alert("Task added successfully!");
      toggleAddModal();
    } catch (error) {
      console.error("There was an error adding the task", error);
      alert("Error adding task.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const updatedTask = await axios.put(
        `/api/tasks/${tasks[editIndex]._id}`,
        formData
      );
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? updatedTask.data : task
      );
      setTasks(updatedTasks);
      alert("Task updated successfully!");
      toggleEditModal();
    } catch (error) {
      console.error("There was an error updating the task", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(tasks[index]);
    toggleEditModal();
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`/api/tasks/${tasks[index]._id}`);
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("There was an error deleting the task", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Task Management</h1>
        <Button color="primary" onClick={toggleAddModal}>
          Add Task
        </Button>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={task._id}>
                <th scope="row">{index + 1}</th>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>{task.dueDate}</td>
                <td>{task.status}</td>
                <td>
                  <Button
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No tasks added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Task</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label>
                Title<span style={{ color: "red" }}>*</span>
              </label>
              <input
                placeholder="Enter title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Description<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                className={`form-control ${errors.description ? "is-invalid" : ""
                  }`}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Assigned To<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="select"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={`form-control ${errors.assignedTo ? "is-invalid" : ""
                  }`}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </Input>
              {errors.assignedTo && (
                <div className="invalid-feedback">{errors.assignedTo}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Due Date<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
              />
              {errors.dueDate && (
                <div className="invalid-feedback">{errors.dueDate}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Status<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Input>
              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleAddModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleAddSubmit}>
            Add Task
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Task</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label>
                Title<span style={{ color: "red" }}>*</span>
              </label>
              <input
                placeholder="Enter title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Description<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                className={`form-control ${errors.description ? "is-invalid" : ""
                  }`}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Assigned To<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="select"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className={`form-control ${errors.assignedTo ? "is-invalid" : ""
                  }`}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </Input>
              {errors.assignedTo && (
                <div className="invalid-feedback">{errors.assignedTo}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Due Date<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
              />
              {errors.dueDate && (
                <div className="invalid-feedback">{errors.dueDate}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Status<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Input>
              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleEditSubmit}>
            Update Task
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddTaskPage;
