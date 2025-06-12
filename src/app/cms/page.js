"use client";

import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import QuizIcon from "@mui/icons-material/Quiz";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function DummyCmsDashboard() {
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { logout } = useAuth();
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
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Welcome to Dummy CMS
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is a simple CMS dashboard page for demo purposes.
              </Typography>
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

        {/* CMS Navigation Cards */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
              onClick={() => router.push("/dummy-route")}
            >
              <BusinessIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Businesses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage dummy businesses here.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
              onClick={() => router.push("/dummy-quizzes")}
            >
              <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Quizzes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage dummy quizzes.
              </Typography>
            </Box>
          </Grid>
        </Grid>
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
