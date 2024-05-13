import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import Base from "../Base/Base.jsx";

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
      if (!categoryData.name.trim()) {
        setErrorMessage("All Category is required.");
        return;
      }
      else if (!categoryData.description.trim()) {
        setErrorMessage("All Category is required.");
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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
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
            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={handleUpdate}
              >
                Update
              </Button>
              {successMessage && (
                <div style={{ color: "green" }}>{successMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default EditCategory;
