import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";


const Addinventory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/category/getall"
      );
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  const handleAddInventoryItem = async () => {
    // Reset previous errors
    setNameError("");
    setDescriptionError("");
    setPriceError("");
    setQuantityError("");
    setCategoryError("");
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    let isValid = true;
    if (name.trim() === "") {
      setNameError("Name is required");
      isValid = false;
    }
    if (description.trim() === "") {
      setDescriptionError("Description is required");
      isValid = false;
    }
    if (price.trim() === "") {
      setPriceError("Price is required");
      isValid = false;
    }
    if (quantity.trim() === "") {
      setQuantityError("Quantity is required");
      isValid = false;
    }
    if (!category) {
      setCategoryError("Category is required");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // If validation passes, proceed with adding inventory item
    try {
      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/inventory/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price,
            quantity,
            category,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        navigate("/getinventories");
      } else {
        setErrorMessage(data.error || "Error adding inventory item");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("An error occurred while adding inventory item");
    }
  };

  return (
    <Base title="Add Inventory Item">
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
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              label="Item Description"
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
            <div className="row">
              <div className="col-md-6">
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  error={!!priceError}
                  helperText={priceError}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  label="Quantity"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  error={!!quantityError}
                  helperText={quantityError}
                />
              </div>
            </div>
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setCategory(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  variant="outlined"
                  fullWidth
                  error={!!categoryError}
                  helperText={categoryError}
                />
              )}
              style={{ margin: "10px 0" }}
            />
            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddInventoryItem}
                style={{ marginTop: "20px" }}
              >
                Add Inventory Item
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
          </div>
        </div>
        </div>
        </Box>
    </Base>
  );
};

export default Addinventory;
