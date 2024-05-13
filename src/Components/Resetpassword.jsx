import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      if (!email) {
        setErrorMessage("Please enter email");
        return;
      }
      if (!newPassword) {
        setErrorMessage("Please enter newPassword");
        return;
      }
      if (!confirmPassword) {
        setErrorMessage("Please enter confirmPassword");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      const payload = {
        email,
        newpassword: newPassword,
        confirmpassword: confirmPassword,
      };
      const res = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/user/resetPassword",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.message) {
        setSuccessMessage(data.message);
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErrorMessage("An error occurred while resetting the password.");
    }
  };

  return (
    <Base>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6" style={{ marginTop: "30px" }}>
            <img src="public/Password.png" alt="Login" style={{ maxWidth: "90%" }} />
          </div>
          <div className="col-lg-4" style={{ marginTop: "140px" }}>
              <form>
                <TextField
                  id="outlined-basic-email"
                  label="Email"
                  variant="outlined"
                  value={email}
                  fullWidth
                  style={{ marginTop: "50px" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </form>
              <br />
              <form>
                <TextField
                  id="outlined-basic-new-password"
                  label="New Password"
                  variant="outlined"
                  style={{ marginTop: "20px" }}
                  type="password"
                  value={newPassword}
                  fullWidth
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </form>
              <br />
              <form>
                <TextField
                  id="outlined-basic-confirm-password"
                  label="Confirm Password"
                  variant="outlined"
                  style={{ marginTop: "20px" }}
                  type="password"
                  value={confirmPassword}
                  fullWidth
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </form>
              <div className="text-center mt-4">
                <Button
                  sx={{ backgroundColor: "#198754" }}
                  type="submit"
                  variant="contained"
                  size="medium"
                  style={{ marginTop: "20px", marginRight: "10px" }}
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
                <Button
                  sx={{ backgroundColor: "#198754" }}
                  variant="contained"
                  size="medium"
                  style={{ marginTop: "20px", marginLeft: "10px" }}
                  onClick={() => navigate("/")}
                >
                  Go Back
                </Button>
              </div>
              {errorMessage && (
                <Alert severity="error" style={{ marginTop: "20px" }}>
                  {errorMessage}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" style={{ marginTop: "20px" }}>
                  {successMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
    </Base>
  );
};

export default ResetPassword;
