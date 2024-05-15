import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const navigate = useNavigate();

  const handleAddCategory = async () => {
    // Reset previous errors
    setNameError("");
    setDescriptionError("");
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    let isValid = true;
    if (name.trim() === "") {
      setNameError("Category name is required");
      isValid = false;
    }

    if (description.trim() === "") {
      setDescriptionError("Category Description is required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/category/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        navigate("/getcategories");
      } else {
        setErrorMessage(data.error || "Error adding category");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("An error occurred while adding category");
    }
  };

  return (
    <Base title="Add Category">
      <Box
        sx={{
          backgroundImage: 'url("Inventory.png")',
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundImage: 'url("Inventory.png")',
              p: 3,
              border: 1,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: "#20c997", // Background color with opacity
            }}
            style={{marginTop:"50px"}}
          >
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              label="Category Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!descriptionError}
              helperText={descriptionError}
            />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </div>
            {successMessage && (
              <Alert severity="success" style={{ marginTop: "20px" }}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" style={{ marginTop: "20px" }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
      </Container>
      </Box>
    </Base>
  );
};

export default AddCategory;
