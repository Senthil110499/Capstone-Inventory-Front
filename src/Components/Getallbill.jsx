import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Getallbill = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is missing!");
        }

        const response = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/bill/get",
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setBills(data.bills);
          setError(null);
        } else {
          setError(data.error || "");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleDeleteBill = async (billId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/bill/delete/${billId}`,
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
        setBills((prevBills) =>
          prevBills.filter((bill) => bill._id !== billId)
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
      setError("An error occurred while deleting bill");
    }
  };

  return (
    <Base title="Bills">
      <div className="container mt-4">
        <div className="text-end mb-3">
          <button
            className="btn btn-success"
            style={{ marginRight: "20px" }}
            onClick={() => {
              navigate("/addbill");
            }}
          >
            <i className="bi bi-plus-circle-fill me-1"></i> Add Bills
          </button>
        </div>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-danger">{error}</div>}
        {!loading && (
          <div className="row">
            {bills.map((bill) => (
              <div className="col-md-6 mb-4" key={bill._id}>
                <div className="invoice border p-3 bg-dark text-light">
                  <div className="invoice-header">
                    <h3 className="text-center">INVOICE</h3>
                    <div className="company-details text-end">
                      <div className="border p-1">
                        <p style={{ marginRight: "10px" }}>
                          <b>Order ID : </b>
                          {bill.order}
                        </p>
                        <p style={{ marginRight: "10px" }}>
                          <b>Date :</b>{" "}
                          {format(new Date(bill.date), "yyyy-MM-dd HH:mm:ss")}
                        </p>
                      </div>
                    </div>
                    <div className="customer-details">
                      <div className="border p-1 text-center">
                        <p>
                          <b>From</b>
                        </p>
                        <p>
                          <b>Inventory Billing</b>
                        </p>
                        <p>
                          <b>Email : </b>Invento@gmail.com
                        </p>
                        <p>
                          <b>Location : </b>Chennai-600028
                        </p>
                        <p>
                          <b>To</b>
                        </p>
                        <p>
                          <b>Customer Name : </b>
                          {bill.customer?.name}
                        </p>
                        <p>
                          <b>Email : </b>
                          {bill.customer?.email}
                        </p>
                        <p>
                          <b>Address :</b> {bill.customer?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="invoice-table mt-3">
                    <div className="border p-1">
                      <table className="table table-bordered text-center">
                        <thead>
                          <tr>
                            <th>Product ID</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.items.map((item) => (
                            <tr key={item._id}>
                              <td>{item.product}</td>
                              <td>{item.quantity}</td>
                              <td>{item.price}</td>
                              <td>{item.quantity * item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="invoice-total text-end mt-3">
                    <div className="border p-1">
                      <p style={{ marginRight: "10px" }}>
                        <b>Total Amount :</b> {bill.totalAmount}
                      </p>
                    </div>
                  </div>
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-danger"
                      style={{ marginRight: "20px" }}
                      onClick={() => handleDeleteBill(bill.id || bill._id)}
                    >
                      <i className="bi bi-trash-fill me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Base>
  );
};

export default Getallbill;
