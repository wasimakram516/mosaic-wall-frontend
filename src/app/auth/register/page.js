// src/pages/Register.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import bgLarge from "../assets/stageBig-1920x1080.jpg";
import bgSmall from "../assets/stage-1080x1920.jpg";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { register: handleRegister } = useAuth(); // Will add to AuthContext

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showMessage("Passwords don't match");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      await handleRegister(form.name, form.email, form.password);
      setSuccess("Login successful!");
      navigate("/");
    } catch (err) {
      // For Joi validation errors (400 status)
      if (err.response?.status === 400) {
        showMessage(err.response.data.message);
      }
      // For other errors
      else {
        showMessage(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundImage: { xs: `url(${bgSmall})`, sm: `url(${bgLarge})` },
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: 400 },
          p: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            textDecoration: "none",
            mb: 4,
          }}
        >
          EventWheel
        </Typography>
        <Typography variant="h6" sx={{ my: 2, color: "text.secondary" }}>
          Welcome! Please Sign Up to start creating amazing events.
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleInputChange}
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleInputChange}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.confirmPassword}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>

          <Typography sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component={Link} to="/">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
