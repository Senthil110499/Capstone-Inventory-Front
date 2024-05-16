import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Button } from "@mui/material";
import Box from "@mui/material/Box";

const AddOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const customersResponse = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/customer/getallcustomers",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        const customersData = await customersResponse.json();

        if (!customersResponse.ok) {
          console.error(
            "Error fetching customers:",
            customersData.error || "Unknown error"
          );
          return;
        }

        setCustomers(customersData.data || []);

        const itemsResponse = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/inventory/getall",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        const itemsData = await itemsResponse.json();

        if (!itemsResponse.ok) {
          console.error(
            "Error fetching items:",
            itemsData.error || "Unknown error"
          );
          return;
        }

        console.log("Items Data:", itemsData);

        setItems(itemsData.inventoryItems || []);
      } catch (error) {
        console.error("Error fetching customers and items:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddOrder = async () => {
    try {
      if (!selectedCustomer) {
        setErrorMessage("Please select a customer.");
        return;
      }

      if (selectedItems.length === 0) {
        setErrorMessage("Please select at least one item.");
        return;
      }

      const invalidQuantityItem = selectedItems.find(
        (item) =>
          !quantities[item._id] || isNaN(quantities[item._id]) || quantities[item._id] <= 0
      );

      if (invalidQuantityItem) {
        setErrorMessage(`Please enter a valid quantity for ${invalidQuantityItem.name}`);
        return;
      }

      const orderItems = selectedItems.map((item) => ({
        item: item._id,
        quantity: quantities[item._id],
      }));

      const orderData = {
        customer: selectedCustomer._id,
        items: orderItems,
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/order/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Order placed successfully:", data);
        navigate("/getorders");
      } else {
        console.error("Error placing order:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error occurred while adding order:", error);
    }
  };

  return (
    <Base title="Add Order">
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
              <label htmlFor="customerSelect" className="form-label">
                Select Customer
              </label>
              <Autocomplete
                options={customers}
                getOptionLabel={(customer) => customer.name}
                onChange={(_, value) => setSelectedCustomer(value)}
                renderInput={(params) => (
                  <TextField {...params} id="customerSelect" />
                )}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemSelect" className="form-label">
                Select Items
              </label>
              <Autocomplete
                multiple
                options={items}
                getOptionLabel={(item) => item.name}
                onChange={(_, value) => setSelectedItems(value)}
                renderInput={(params) => (
                  <TextField {...params} id="itemSelect" />
                )}
              />
            </div>
            {selectedItems.map((item) => (
              <div key={item._id} className="mb-3">
                <TextField
                  id={`quantity-${item._id}`}
                  label={`Quantity for ${item.name}`}
                  type="number"
                  variant="outlined"
                  value={quantities[item._id] || ""}
                  onChange={(e) =>
                    setQuantities({ ...quantities, [item._id]: e.target.value })
                  }
                />
              </div>
            ))}
            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddOrder}
                style={{ marginTop: "20px" }}
              >
                Add Order
              </Button>
              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
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

export default AddOrder;
