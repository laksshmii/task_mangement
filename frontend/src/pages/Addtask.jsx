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
import { toast } from "react-toastify";

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

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/tasks/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
      console.error("There was an error fetching tasks", error);
      toast.error("Error fetching tasks. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employees/getEmployee"
      );
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
    if (!formData.assignedTo)
      newErrors.assignedTo = "Assigned To is required.";
    if (!formData.dueDate.trim()) newErrors.dueDate = "Due date is required.";
    if (!formData.status.trim()) newErrors.status = "Status is required.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
      setTasks([...tasks, response.data]);
      toast.success("Task added successfully!", {
        position: "top-right",
        autoClose: 6000,
      });
      toggleAddModal();
    } catch (error) {
      console.error("There was an error adding the task", error);
      toast.error("Error adding task. Please try again later.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found. Please log in again.");
      return;
    }

    try {
      const updatedTask = await axios.put(
        `http://localhost:5000/api/tasks/update/${tasks[editIndex].id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? updatedTask.data : task
      );
      setTasks(updatedTasks);
      fetchTasks();
      toast.success("Task updated successfully!", {
        position: "top-right",
        autoClose: 6000,
      });
      toggleEditModal();
    } catch (error) {
      console.error("There was an error updating the task", error);
      toast.error("Error updating task. Please try again later.");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(tasks[index]);
    toggleEditModal();
  };

  const handleDelete = async (index) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/delete/${tasks[index].id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);

      toast.success("Task deleted successfully!", {
        position: "top-right",
        autoClose: 6000,
      });

      fetchTasks();
    } catch (error) {
      console.error("There was an error deleting the task", error);
      toast.error("Error deleting task", {
        position: "top-right",
        autoClose: 6000,
      });
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
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
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
                className={`form-control ${errors.assignedTo ? "is-invalid" : ""}`}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.name}>
                    {emp.name}
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
              <input
                type="text"
                name="status"
                placeholder="Enter status"
                value={formData.status}
                onChange={handleChange}
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
              />
              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddSubmit}>
            Add Task
          </Button>
          <Button color="secondary" onClick={toggleAddModal}>
            Cancel
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
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
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
                className={`form-control ${errors.assignedTo ? "is-invalid" : ""}`}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp.name}>
                    {emp.name}
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
              <input
                type="text"
                name="status"
                placeholder="Enter status"
                value={formData.status}
                onChange={handleChange}
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
              />
              {errors.status && (
                <div className="invalid-feedback">{errors.status}</div>
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditSubmit}>
            Update Task
          </Button>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddTaskPage;
