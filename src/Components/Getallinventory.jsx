import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Box from "@mui/material/Box";

const Getallinventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/inventory/getall"
        );
        const data = await response.json();

        if (response.ok) {
          setInventoryItems(data.inventoryItems);
          setError(null);
        } else {
          setError(data.error || "");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching inventory items");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const handleDelete = async (inventoryId) => {
    try {
      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/inventory/delete/${inventoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setInventoryItems((prevInventories) =>
          prevInventories.filter((inventory) => inventory.id !== inventoryId)
        );

        setTimeout(() => {
          window.location.reload();
        }, 500);

        console.log(data.message);
      } else {
        setError(data.error || "");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setError("An error occurred while deleting inventory");
    }
  };

  return (
    <Base title="Inventory Items">
      <Box
        sx={{
          backgroundImage: 'url("img-inventory.png")',
          height: "100vh",
          backgroundRepeat:"no-repeat",
          backgroundPositionX:"center"
        }}
      >
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-9 offset-md-3">
            <div className="text-end mb-3">
              <button
                className="btn btn-success"
                style={{ marginRight: "20px" }}
                onClick={() => {
                  navigate("/addinventory");
                }}
              >
                Add Inventory
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="text-center text-danger mt-3">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center table-success table table-bordered border-primary">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {format(new Date(item.date), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => {
                          const inventoryId = item.id || item._id;
                          navigate(`/editinventory/${inventoryId}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id || item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </Box>
    </Base>
  );
};

export default Getallinventory;
