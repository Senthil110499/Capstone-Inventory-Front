import React, { useEffect, useState } from "react";
import Base from "../Base/Base.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Box from "@mui/material/Box";

const Getallcategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://inventory-billing-app-l2ei.onrender.com/api/category/getall"
        );
        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories);
        } else {
          setError(data.error || "");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching categories");
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetch(
        `https://inventory-billing-app-l2ei.onrender.com/api/category/delete/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
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
      setError("An error occurred while deleting category");
    }
  };

  return (
    <Base title="Categories">
      <Box className="back"
        sx={{
          backgroundImage: 'url("img-inventory.png")',
          height:"100vh",
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
                  navigate("/addcategory");
                }}
              >
                <i className="bi bi-plus-circle-fill me-1"></i> Add Category
              </button>
            </div>
          </div>
        </div>

        {categories && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center table-success table table-bordered border-primary">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((data, index) => (
                  <tr key={index}>
                    <td>{data.name}</td>
                    <td>{data.description}</td>
                    <td>
                      {format(new Date(data.date), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => {
                          const categoryId = data.id || data._id;
                          navigate(`/editcategory/${categoryId}`);
                        }}
                      >
                        <i className="bi bi-pencil-fill me-1"></i> Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(data.id || data._id)}
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
};

export default Getallcategory;
