import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

const EditInventory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { inventoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/category/getall"
      );
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();

    const fetchInventoryItem = async () => {
      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/inventory/edit/${inventoryId}`
      );
      const data = await response.json();

      if (response.ok) {
        const { name, description, price, quantity, category } = data;
        setName(name);
        setDescription(description);
        setPrice(price);
        setQuantity(quantity);
        setCategory(category);
      } else {
        console.error("Error fetching inventory item:", data.error);
      }
    };

    fetchInventoryItem();
  }, [inventoryId]);

  const handleEditInventoryItem = async () => {
    try {
      // Validate input fields
      if (!name) {
        setNameError(true);
        return;
      }
      if (!description) {
        setDescriptionError(true);
        return;
      }
      if (!price || isNaN(price)) {
        setPriceError(true);
        return;
      }
      if (!quantity || isNaN(quantity)) {
        setQuantityError(true);
        return;
      }

      // If inventoryId is invalid, log error and return
      if (!inventoryId) {
        console.error("Invalid inventoryId:", inventoryId);
        return;
      }

      // Make API call to edit inventory item
      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/inventory/edit/${inventoryId}`,
        {
          method: "PUT",
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
        setErrorMessage("");
        navigate("/getinventories");
      } else {
        setSuccessMessage("");
        setErrorMessage(data.error || "Error editing inventory item");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setSuccessMessage("");
      setErrorMessage("An error occurred while editing inventory item");
    }
  };

  return (
    <Base title="Edit Inventory Item">
      <Box
        sx={{
          backgroundImage: 'url("Inventory.png")',
          height: "100vh",
        }}
      >
      <div className="container">
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
              error={nameError}
              helperText={nameError && "Name is required"}
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
              error={descriptionError}
              helperText={descriptionError && "Description must be a number"}
            />
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setPriceError(false);
              }}
              error={priceError}
              helperText={priceError && "Price must be a number"}
            />
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setQuantityError(false);
              }}
              error={quantityError}
              helperText={quantityError && "Quantity must be a number"}
            />
            <Autocomplete
              options={categories}
              getOptionLabel={(option) => option.name}
              value={categories.find((cat) => cat._id === category) || null}
              onChange={(event, newValue) =>
                setCategory(newValue ? newValue._id : "")
              }
              renderInput={(params) => (
                <TextField {...params} label="Category" variant="outlined" />
              )}
            />
            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditInventoryItem}
                style={{ marginTop: "20px" }}
              >
                Update
              </Button>
              {successMessage && (
                <div style={{ marginTop: "20px" }}>
                  <Alert severity="success">{successMessage}</Alert>
                </div>
              )}
              {errorMessage && (
                <div style={{ marginTop: "20px" }}>
                  <Alert severity="error">{errorMessage}</Alert>
                </div>
              )}
            </div>
            </Box>
          </div>
        </div>
      </div>
      </Box>
    </Base>
  );
};

export default EditInventory;

