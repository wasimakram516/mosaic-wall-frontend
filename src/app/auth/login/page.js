import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";
import bgLarge from "../assets/stageBig-1920x1080.jpg";
import bgSmall from "../assets/stage-1080x1920.jpg";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { login: handleLogin } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSuccess("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const userData = await handleLogin(
        form.email,
        form.password,
        form.rememberMe
      );
      setSuccess("Login successful!");

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        showMessage("Unauthorized role. Contact support.");
      }
    } catch (error) {
      showMessage(
        error.response.data.message || "Login failed. Please try again."
      );
      setSuccess("");
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
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: { xs: "90%", sm: 400 },
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
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
          Welcome Back! Please Login to create an Event.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleInputChange}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleInputChange}
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

          {/* ✅ Remember Me Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.rememberMe}
                onChange={handleInputChange}
                name="rememberMe"
                color="primary"
              />
            }
            label="Remember Me"
            sx={{ mt: 1, textAlign: "left", width: "100%" }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Typography sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link component={Link} to="/register">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
