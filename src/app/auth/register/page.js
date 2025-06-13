"use client";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMessage } from "../../contexts/MessageContext";
import { useAuth } from "../../contexts/AuthContext";
// import bgLarge from "../assets/stageBig-1920x1080.jpg";
// import bgSmall from "../assets/stage-1080x1920.jpg";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { showMessage } = useMessage();
  const { register: handleRegister } = useAuth(); // Will add to AuthContext

  // Email validation regex pattern
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Password validation - at least 8 chars with 1 number and 1 special char
  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    return password.length >= 6 && hasNumber && hasSpecialChar;
  };

  // Validate name - at least 2 characters
  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  // Main form validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (!validateName(form.name)) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must be at least 6 characters, numeric and a special character";
      isValid = false;
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types in a field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccess("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    if (form.password !== form.confirmPassword) {
      showMessage("Passwords don't match");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      await handleRegister(form.name, form.email, form.password);
      setSuccess("Registration successful!");
      router.push("/auth/login");
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
        // backgroundImage: { xs: `url(${bgSmall})`, sm: `url(${bgLarge})` },
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: 6,
        my: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: 400 },

          p: 3, // Reduced padding
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component={Link}
          href="/"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            textDecoration: "none",
            mb: 4,
          }}
        >
          Mosaic Wall
        </Typography>
        <Typography variant="h6" sx={{ my: 2, color: "text.secondary" }}>
          Welcome! Please Sign Up.
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
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
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
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
            Already have an account? <Link href="/auth/login">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
