import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, Input, Badge } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { IoMdCreate, IoMdTrash } from "react-icons/io";

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
  const [userRole, setUserRole] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found. Please log in again.");

    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      const url = userRole === 'admin'
        ? 'http://localhost:5000/api/tasks/get'
        : `http://localhost:5000/api/tasks/assigned/${userId}`;

      const tasksResponse = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(tasksResponse.data);

      const employeesResponse = await axios.get("http://localhost:5000/api/employees/getEmployee");
      setEmployees(employeesResponse.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Error fetching data. Please try again later.");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserId(user?.id || "");
      setUserRole(user?.role || "");
      fetchData();
    } else {
      toast.error("User data not found. Please log in again.");
    }
  }, []);

  const toggleModal = (modalType) => {
    if (modalType === 'add') {
      setFormData({ title: "", description: "", assignedTo: "", dueDate: "", status: "" });
      setErrors({});
    }
    if (modalType === 'edit') setErrors({});
    modalType === 'add' ? setIsAddModalOpen(!isAddModalOpen) : setIsEditModalOpen(!isEditModalOpen);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.assignedTo) newErrors.assignedTo = "Assigned To is required.";
    if (!formData.dueDate.trim()) newErrors.dueDate = "Due date is required.";
    if (!formData.status.trim()) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found. Please log in again.");

    const url = type === 'add'
      ? "http://localhost:5000/api/tasks/add"
      : `http://localhost:5000/api/tasks/update/${tasks[editIndex].id}`;

    try {
      const method = type === 'add' ? 'post' : 'put';
      const response = await axios[method](url, formData, { headers: { Authorization: `Bearer ${token}` } });

      setTasks(type === 'add' ? [...tasks, response.data] : tasks.map((task, index) => (index === editIndex ? response.data : task)));
      toast.success(`${type === 'add' ? 'Added' : 'Updated'} task successfully!`);
      fetchData();
      toggleModal(type === 'add' ? 'add' : 'edit');
    } catch (error) {
      toast.error(`${type === 'add' ? 'Error adding' : 'Error updating'} task.`);
    }
  };

  const handleDelete = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found. Please log in again.");

    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${tasks[index].id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(tasks.filter((_, i) => i !== index));
      toast.success("Task deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Error deleting task.");
    }
  };

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/tasks/status/${currentTaskId}`, { status: selectedStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Status updated successfully");
      fetchData();
      setIsStatusModalOpen(false);
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Task Management</h1>
        {userRole === "admin" && <Button color="success" onClick={() => toggleModal('add')}>Add Task</Button>}
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
              <tr key={task.id}>
                <th scope="row">{index + 1}</th>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo}</td>
                <td>{task.dueDate}</td>
                <td><Badge color={task.status === 'pending' ? 'success' : 'warning'}>{task.status}</Badge></td>
                <td>
                  {userRole === "admin" ? (
                    <>
                      <IoMdCreate title="Edit Task" style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => { setEditIndex(index); setFormData(task); toggleModal('edit'); }} />
                      <IoMdTrash title="Delete Task" style={{ cursor: 'pointer' }} onClick={() => handleDelete(index)} />
                    </>
                  ) : (
                    <IoMdCreate title="Update Status" style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => { setCurrentTaskId(task.id); setIsStatusModalOpen(true); }} />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="text-center">No tasks added yet.</td></tr>
          )}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} toggle={() => toggleModal('add')}>
        <ModalHeader toggle={() => toggleModal('add')}>Add Task</ModalHeader>
        <ModalBody>
          <form>
            {['title', 'description', 'assignedTo', 'dueDate', 'status'].map((field, idx) => (
              <div className="form-group" key={idx}>
                <label>{`${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
                <Input
                  type={field === 'dueDate' ? 'date' : field === 'status' ? 'select' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  invalid={!!errors[field]}
                >
                  {field === 'status' && (
                    <>
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </>
                  )}
                </Input>
                {errors[field] && <div className="text-danger">{errors[field]}</div>}
              </div>
            ))}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleSubmit(e, 'add')}>Add Task</Button>{' '}
          <Button color="secondary" onClick={() => toggleModal('add')}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} toggle={() => toggleModal('edit')}>
        <ModalHeader toggle={() => toggleModal('edit')}>Edit Task</ModalHeader>
        <ModalBody>
          <form>
            {['title', 'description', 'assignedTo', 'dueDate', 'status'].map((field, idx) => (
              <div className="form-group" key={idx}>
                <label>{`${field.charAt(0).toUpperCase() + field.slice(1)}`}</label>
                <Input
                  type={field === 'dueDate' ? 'date' : field === 'status' ? 'select' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  invalid={!!errors[field]}
                >
                  {field === 'status' && (
                    <>
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </>
                  )}
                </Input>
                {errors[field] && <div className="text-danger">{errors[field]}</div>}
              </div>
            ))}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => handleSubmit(e, 'edit')}>Save Changes</Button>{' '}
          <Button color="secondary" onClick={() => toggleModal('edit')}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Status Modal */}
      <Modal isOpen={isStatusModalOpen} toggle={() => setIsStatusModalOpen(false)}>
        <ModalHeader toggle={() => setIsStatusModalOpen(false)}>Update Task Status</ModalHeader>
        <ModalBody>
          <select onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleStatusUpdate}>Update Status</Button>{' '}
          <Button color="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddTaskPage;
