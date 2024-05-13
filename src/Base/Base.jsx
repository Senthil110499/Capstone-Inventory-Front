import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import PeopleSharpIcon from "@mui/icons-material/PeopleSharp";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../style/style.css";

const Base = ({ title, children }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <header>
        <AppBar sx={{ backgroundColor: "purple" }} position="relative">
          <Toolbar variant="dense">
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1530 },
              }}
            >
              <Typography
                sx={({ mr: 5 }, { fontSize: 24 })}
                style={{ marginTop: "5px" }}
              >
                Inventory Billing
              </Typography>
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={() => navigate("/home")}
                aria-label="dashboard"
                sx={({ mr: 20 }, { fontSize: 20 })}
              >
                {" "}
                <DashboardSharpIcon />
                Dashboard
              </IconButton>
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={() => navigate("/getcategories")}
                aria-label="category"
                sx={({ mr: 5 }, { fontSize: 20 })}
              >
                {" "}
                <CategoryIcon />
                Categories
              </IconButton>{" "}
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={() => navigate("/getinventories")}
                aria-label="inventory"
                sx={({ mr: 5 }, { fontSize: 20 })}
              >
                <StoreRoundedIcon /> Inventories
              </IconButton>{" "}
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={() => navigate("/getcustomers")}
                aria-label="customer"
                sx={({ mr: 5 }, { fontSize: 20 })}
              >
                {" "}
                <PeopleSharpIcon />
                Customers
              </IconButton>{" "}
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={() => navigate("/getorders")}
                aria-label="order"
                sx={({ mr: 5 }, { fontSize: 20 })}
              >
                {" "}
                <ShoppingCartIcon />
                Orders
              </IconButton>{" "}
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={() => navigate("/getbills")}
                aria-label="bill"
                sx={({ mr: 5 }, { fontSize: 20 })}
              >
                {" "}
                <ReceiptIcon />
                Bills
              </IconButton>{" "}
              <IconButton
                edge="start"
                color="#e91e63"
                onClick={handleLogout}
                aria-label="logout"
                sx={({ mr: 5 }, { fontSize: 20 })}
              >
                {" "}
                <ExitToAppIcon />
                LogOut
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </header>
      <main>
        <h1 className="title">{title}</h1>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Base;
