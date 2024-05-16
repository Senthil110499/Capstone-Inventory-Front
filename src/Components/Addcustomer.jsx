import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

const AddCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAddCustomer = async () => {
    try {
      // Validation
      if (!customerData.name) {
        setErrorMessage("Name field cannot be empty");
        return;
      }
      if (!customerData.email) {
        setErrorMessage("Email field cannot be empty");
        return;
      }
      if (!customerData.address) {
        setErrorMessage("Address field cannot be empty");
        return;
      }
      if (!customerData.phoneNumber) {
        setErrorMessage("Phone Number field cannot be empty");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        return setErrorMessage("Authentication token is missing!");
      }

      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/customer/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(customerData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage("");
        navigate("/getcustomers");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSuccessMessage("");
        setErrorMessage(
          response.statusText || errorData.error || "Error adding customer"
        );
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setSuccessMessage("");
      setErrorMessage("An error occurred while adding customer");
    }
  };

  return (
    <Base title="Add Customer">
      <Box
        sx={{
          backgroundImage: 'url("Inventory.png")',
          height: "100vh",
        }}
      >
      <div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-md-6">
            <Box
            sx={{
              backgroundImage: 'url("Inventory.png")',
              p: 3,
              border: 1,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: "#20c997", // Background color with opacity
            }}
            style={{marginTop:"20px"}}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                required
                id="name"
                value={customerData.name}
                onChange={(e) =>
                  setCustomerData({ ...customerData, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={customerData.email}
                onChange={(e) =>
                  setCustomerData({ ...customerData, email: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={customerData.address}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                value={customerData.phoneNumber}
                onChange={(e) =>
                  setCustomerData({
                    ...customerData,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="text-center">
              <button className="btn btn-primary" onClick={handleAddCustomer}>
                Add Customer
              </button>
            </div>
            {successMessage && (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
            </Box>
          </div>
        </div>
      </div>
      </Box>
    </Base>
  );
};

export default AddCustomer;

