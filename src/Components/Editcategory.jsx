import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import Base from "../Base/Base.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      if (!categoryData.name.trim() || !categoryData.description.trim()) {
        setErrorMessage("All fields are required.");
        return;
      }

      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/category/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        }
      );

      if (response.ok) {
        const updatedCategory = await response.json();
        setSuccessMessage("Category updated successfully.");
        navigate("/getcategories");
      } else {
        const errorData = await response.json();
        console.error("Failed to update category:", errorData.error);
        setErrorMessage("Failed to update category.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("Error occurred while updating category.");
    }
  };

  return (
    <Base title="Edit Category">
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
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={categoryData.name}
              onChange={handleChange}
              error={!!errorMessage}
              helperText={errorMessage}
            />
            <TextField
              name="description"
              value={categoryData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              error={!!errorMessage}
              helperText={errorMessage}
            />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Update
              </Button>
              {successMessage && (
                <div style={{ color: "green", marginTop: "10px" }}>
                  {successMessage}
                </div>
              )}
            </div>
          </Box>
        </Container>
      </Box>
    </Base>
  );
};

export default EditCategory;
