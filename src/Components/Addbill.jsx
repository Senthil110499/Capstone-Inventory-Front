import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
const Addbill = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
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
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error occurred while fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCreateBill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing!");
      }

      const response = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/bill/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ orderId: selectedOrderId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setBill(data.bill);
        setSuccessMessage("Bills created successfully");
        setSuccess(true);
      } else {
        setMessage(data.error || "Error creating bill");
        setBill(null);
        setError("");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage("An error occurred while creating the bill");
      setBill(null);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Base title="Add Bill">
      <div className="container">
        <div className="row">
          <div className="col-md-9 offset-md-1 mt-5">
            <div className="mb-3">
              <label htmlFor="orderSelect" className="form-label">
                Select Order
              </label>
              <select
                className="form-select"
                id="orderSelect"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
              >
                <option value="">Select an order</option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.customer.name} - {order.date}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginLeft: "10px", marginTop: "20px" }}
                onClick={handleCreateBill}
              >
                Create Bill
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginLeft: "10px", marginTop: "20px" }}
                onClick={() => navigate("/getbills")}
              >
                Go Back
              </button>
            </div>

            {loading && <div className="text-center mt-3">Loading...</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {successMessage && (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            )}

            {bill && (
              <div className="mt-3">
                <p>Bill ID: {bill._id}</p>
                <p>Order ID: {bill.order}</p>
                <p>Customer Name: {bill.customer?.name}</p>
                <p>Email: {bill.customer?.email}</p>
                <p>Address: {bill.customer?.address}</p>
                <p>Phone Number: {bill.customer?.phonenumber}</p>
                {bill.items.map((item) => (
                  <div key={item._id}>
                    <p>Item: {item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price}</p>
                  </div>
                ))}
                <p>Total Amount: {bill.totalAmount}</p>
                <p>
                  Date: {format(new Date(bill.date), "yyyy-MM-dd HH:mm:ss")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Addbill;
