import React, { useState, useEffect } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Getallcustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token is missing!");
        }

        const response = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/customer/getallcustomers",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setCustomers(data.data);
          console.log("Customers Data:", data);
          setError(null);
        } else {
          setError(data.error || "");
        }
      } catch (error) {
        console.error("Error occurred:", error.message);
        setError("An error occurred while fetching customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/customer/delete/${customerId}`,
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
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer._id !== customerId)
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
    <Base title="Customers">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="text-end">
              <button
                className="btn btn-success"
                style={{ marginRight: "20px" }}
                onClick={() => {
                  navigate("/addcustomer");
                }}
              >
                <i className="bi bi-plus-circle-fill me-1"></i> Add Customer
              </button>
            </div>
            <br />
            {loading && (
              <div className="text-center ">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {error && <div className="text-center text-danger">{error}</div>}
            {!loading && (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {customers.map((customer) => (
                  <div className="col" key={customer._id}>
                    <div className="card h-100">
                      <div className="card-body text-center card text-bg-secondary">
                        <img src="Profile.webp" alt="Signup Image" style={{ width: "100%" }} />
                        <hr />
                        <h5 className="card-title">
                          <b>Name : </b> {customer.name}
                        </h5>
                        <p className="card-text">
                          <b>Email : </b> {customer.email}
                        </p>
                        <p className="card-text">
                          <b>Address : </b> {customer.address}
                        </p>
                        <p className="card-text">
                          <b>Phone Number : </b> {customer.phoneNumber}
                        </p>
                        <p className="card-text">
                          <b>Date :</b>{" "}
                          {format(
                            new Date(customer.date),
                            "yyyy-MM-dd HH:mm:ss"
                          )}
                        </p>
                        {/* <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(customer.id || customer._id)
                          }
                        >
                          <i className="bi bi-trash-fill me-1"></i> Delete
                        </button> */}
                        <button
                          className="btn new mb-3"
                          onClick={() => {
                            handleDelete(customer.id || customer._id);
                          }}
                        >
                          <i
                            className="fa-solid fa-trash icon3"
                            style={{ color: "red" }}
                          ></i>{" "}
                          <span style={{ color: "red" }}>Delete</span>
                        </button>
                        <hr />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Getallcustomer;
