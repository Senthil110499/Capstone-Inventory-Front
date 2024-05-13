import React, { useState } from "react";
import Base from "../Base/Base.jsx";
import { TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignup = async () => {
    try {
      if (!username) {
        setErr("Please enter username");
        return;
      }
      if (!email) {
        setErr("Please enter email");
        return;
      }
      if (!password) {
        setErr("Please enter password");
        return;
      }

      const payload = { username, email, password };
      const res = await fetch(
        "https://inventory-billing-app-l2ei.onrender.com/api/user/signup",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.token) {
        setErr("");
        setSuccessMessage("Signup successful. You can now login.");
        navigate("/");
      } else if (data.success) {
        setSuccessMessage(data.message);
      } else {
        setErr(data.error);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setErr("An error occurred during sign-up.");
    }
  };

  return (
    <Base>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4" style={{ marginTop: "140px" }}>
            <form>
              <TextField
                id="outlined-basic-username"
                label="Username"
                variant="outlined"
                value={username}
                fullWidth
                style={{ marginTop: "50px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </form>
            <br />
            <form>
              <TextField
                id="outlined-basic-email"
                label="Email"
                variant="outlined"
                value={email}
                fullWidth
                style={{ marginTop: "20px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </form>
            <br />
            <form>
              <TextField
                id="outlined-basic-password"
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                fullWidth
                style={{ marginTop: "20px" }}
                InputProps={{
                  autoComplete: "new-password",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="contained"
                size="medium"
                style={{ marginTop: "20px", marginRight: "10px" }}
                onClick={handleSignup}
                sx={{ backgroundColor: "#198754" }}
              >
                Signup
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="medium"
                sx={{ backgroundColor: "#198754" }}
                style={{ marginTop: "20px", marginLeft: "10px" }}
                onClick={() => navigate("/")}
              >
                Back to Login
              </Button>
            </div>

            {err && (
              <Alert severity="error" style={{ marginTop: "20px" }}>
                {err}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" style={{ marginTop: "20px" }}>
                {successMessage}
              </Alert>
            )}
          </div>
          <div className="col-md-6" style={{marginTop:"50px"}}>
            <img src="src/sign-up.png" alt="Signup Image" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Signup;
