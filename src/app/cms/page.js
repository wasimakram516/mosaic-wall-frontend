"use client";

import {
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

import WallIcon from "@mui/icons-material/Wallpaper"; // For Walls
import UploadIcon from "@mui/icons-material/CloudUpload"; // For Uploads
import DashboardCard from "@/app/components/DashboardCard";
import { useAuth } from "@/app/contexts/AuthContext";

export default function CmsDashboard() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* Heading Section */}
      <Box sx={{ mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexWrap="wrap"
          rowGap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome to Mosaic Wall CMS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have full access to manage walls and uploads.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mt: 3 }} />
      </Box>

      {/* CMS Navigation Cards */}
      <Grid
        container
        spacing={3}
        justifyContent={{ xs: "center", sm: "flex-start" }}
        sx={{ mt: 1 }}
      >
        <DashboardCard
          title="Walls"
          description="View and manage your walls."
          buttonLabel="Manage Walls"
          icon={<WallIcon />}
          color="primary.main"
          route="/cms/walls"
        />
        <DashboardCard
          title="Uploads"
          description="View and manage your Uploads."
          buttonLabel="Manage Uploads"
          icon={<UploadIcon />}
          color="#ff7043"
          route="/cms/uploads"
        />
      </Grid>
    </Container>
  );
}
