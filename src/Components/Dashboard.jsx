import React, { useEffect, useState } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const Dashboard = () => {
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);
  const [orders, setOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          setError(null);
        } else {
          setError(data.error || "");
        }
      } catch (error) {
        console.error("", error);
        setError("");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const customerData = orders.reduce((acc, order) => {
    const existingCustomer = acc.find(
      (customer) => customer.name === order.customer.name
    );

    if (existingCustomer) {
      existingCustomer.totalOrders += 1;
    } else {
      acc.push({
        name: order.customer.name,
        totalOrders: 1,
      });
    }

    return acc;
  }, []);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          "https://inventory-billing-app-l2ei.onrender.com/api/inventory/getall"
        );

        if (response.data) {
          setInventoryItems(response.data.inventoryItems);
          setError(null);
        } else {
          setError(response.data.error || "");
        }
      } catch (error) {
        console.error("", error);
        setError("An Error fetching inventory items");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, []);

  const chartData = {
    labels: customerData.map((customer) => customer.name),
    datasets: [
      {
        label: "Total Orders",
        data: customerData.map((customer) => customer.totalOrders),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
          "rgba(75, 192, 192)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        beginAtZero: true,
        ticks: {
          color: "#f50057",
          fontSize: 14,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#f50057",
          fontSize: 14,
        },
      },
    },
  };
  const barData = {
    labels: inventoryItems.map((item) => item.name),
    datasets: [
      {
        label: "Quantity",
        data: inventoryItems.map((item) => item.quantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)",
          "rgba(75, 192, 192)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        beginAtZero: true,
        ticks: {
          color: "#ff1744",
          fontSize: 14,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ff1744",
          fontSize: 14,
        },
      },
    },
  };
  return (
    <Base title="Dashboard">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && (
        <div className="container">
          <div className="row justify-content-center" style={{marginTop:"60px"}}>
            <div className="col-md-10">
              <div className="d-flex justify-content-around">
                <div style={{ width: "50%", height: "400px" }}>
                  <Pie data={chartData} options={chartOptions} />
                </div>
                <div style={{ width: "50%", height: "400px" }}>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Base>
  );
};

export default Dashboard;
