import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Box from "@mui/material/Box";

const Getallorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing!");
        }
        const response = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/order/getall",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
          setError(null);
        } else {
          setError(data.error || "");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/order/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
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
      setError("An error occurred while deleting order");
    }
  };

  {
    return (
      <Base title="Orders">
        <Box
        sx={{
          backgroundImage: 'url("img-inventory.png")',
          height: "100vh",
          backgroundRepeat:"no-repeat",
          backgroundPositionX:"center"
        }}
      >
        <div className="container mt-4">
          <div className="text-end mb-3">
            <button
              className="btn btn-success"
              style={{ marginRight: "20px" }}
              onClick={() => {
                navigate("/addorder");
              }}
            >
              Add Order
            </button>
          </div>

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-center text-danger">{error}</div>}

          {!loading && (
            <div className="table-responsive">
              <table className="table table-bordered table-hover text-center table-success table table-bordered border-primary">
                <thead className="table-dark">
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.customer?.name}</td>
                      <td>{order.customer?.email}</td>
                      <td>{order.customer?.address}</td>
                      <td>{order.customer?.phoneNumber}</td>
                      <td>
                        {format(new Date(order.date), "yyyy-MM-dd HH:mm:ss")}
                      </td>
                      <td>
                        <ul className="list-unstyled">
                          {order.items.map((item) => (
                            <li key={item._id}>
                              {item.item?.name} - Quantity: {item.quantity} -
                              Price: {item.item?.price}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>{order.total}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDeleteOrder(order.id || order._id)
                          }
                        >
                          <i className="bi bi-trash-fill me-1"></i> Delete
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
  }
};

export default Getallorder;
