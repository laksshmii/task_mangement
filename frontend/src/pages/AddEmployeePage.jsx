import React, { useState, useEffect } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Table, Button, Form, FormGroup, Label, Input
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const AddEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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


  const toggleModal = () => {
    setErrors({});
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!isEditing && !formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData };
    if (isEditing) delete payload.password;

    try {
      const url = isEditing
        ? `http://localhost:5000/api/employees/updateEmployee/${employees[editIndex].id}`
        : "http://localhost:5000/api/employees/addEmployee";
      const method = isEditing ? "put" : "post";
      const response = await axios[method](url, payload);

      if (response.status === 200 || response.status === 201) {
        toggleModal();
        toast.success(isEditing ? "Employee updated successfully!" : "Employee added successfully!", {
          position: "top-right",
          autoClose: 6000,
        })
        fetchEmployees();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} employee:`, error);
    }
  };

  const handleEdit = (index, employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    setEditIndex(index);
    setIsEditing(true);
    toggleModal();
  };

  const handleDelete = async (index) => {
    try {
      const employeeToDelete = employees[index];
      await axios.delete(`http://localhost:5000/api/employees/deleteEmployee/${employeeToDelete.id}`);
      toast.success("Employee deleted successfully!", {
        position: "top-right",
        autoClose: 6000
      })
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Employee Management</h1>
        <Button
          color="primary"
          onClick={() => {
            setIsEditing(false);
            setFormData({ name: "", email: "", role: "", password: "" });
            toggleModal();
          }}
        >
          Add Employee
        </Button>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>
                  <Button
                    color="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(index, employee)}
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
              <td colSpan="5" className="text-center">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Employee */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {isEditing ? "Edit Employee" : "Add Employee"}
        </ModalHeader>
        <ModalBody>
          <Form>
            {["name", "email", ...(isEditing ? [] : ["password"]), "role"].map((field) => (
              <FormGroup key={field}>
                <Label for={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                {field === "role" ? (
                  <Input
                    type="select"
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    invalid={!!errors[field]}
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </Input>
                ) : (
                  <Input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    invalid={!!errors[field]}
                  />
                )}
                {errors[field] && <div className="text-danger">{errors[field]}</div>}
              </FormGroup>
            ))}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddEmployeePage;
