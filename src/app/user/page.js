"use client";

import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function UserDashboard() {
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const userDetails = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutDialogOpen(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            rowGap={2}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar sx={{ width: 56, height: 56 }}>
                {userDetails?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {userDetails?.name || "User"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userDetails?.email || "user@example.com"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => setLogoutDialogOpen(true)}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                Logout
              </Button>
            </Box>
          </Stack>

          <Divider sx={{ mt: 3 }} />
        </Box>

        {/* User Content Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Account
          </Typography>
          <Typography variant="body1">
            Welcome to your personal dashboard. Here you can view and manage
            your account details.
          </Typography>
        </Box>

        <ConfirmationDialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          onConfirm={handleLogout}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmButtonText="Logout"
        />
      </Container>
    </Box>
  );
}
