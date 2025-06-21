"use client";

import { useState, useEffect } from "react";
import {
  getWallConfigs,
  createWallConfig,
  updateWallConfig,
  deleteWallConfig,
  getWallConfigBySlug,
} from "@/services/wallConfigService";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";
import ShareFeedbackModal from "@/app/components/ShareFeedbackModal";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import { formatDate } from "@/utils/dateUtils";

export default function WallConfigsPage() {
  const [wallConfigs, setWallConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState("");
  const [currentWallConfig, setCurrentWallConfig] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wallToDelete, setWallToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    mode: "mosaic",
  });

  useEffect(() => {
    fetchWallConfigs();
  }, []);

  const fetchWallConfigs = async () => {
    try {
      setIsLoading(true);
      const response = await getWallConfigs();
      setWallConfigs(response.data);
    } catch (error) {
      console.error("Failed to fetch wall configs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name" && !currentConfig) {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentConfig) {
        await updateWallConfig(currentConfig._id, formData);
      } else {
        await createWallConfig(formData);
      }
      setIsModalOpen(false);
      fetchWallConfigs();
    } catch (error) {
      console.error("Failed to save wall config:", error);
    }
  };

  const handleEdit = (config) => {
    setCurrentConfig(config);
    setFormData({
      name: config.name,
      slug: config.slug,
      mode: config.mode,
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!wallToDelete) return;
    try {
      await deleteWallConfig(wallToDelete._id);
      setDeleteDialogOpen(false);
      setWallToDelete(null);
      fetchWallConfigs();
    } catch (error) {
      console.error("Failed to delete wall config:", error);
    }
  };

  const showQRCode = async (slug) => {
    try {
      setCurrentSlug(slug);
      const response = await getWallConfigBySlug(slug);
      setCurrentWallConfig(response.data);
      setIsQRModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch wall config for QR:", error);
    }
  };

  let uploadUrl = "";
  let qrCodeUrl = "";

  if (typeof window !== "undefined" && currentWallConfig) {
    uploadUrl = `${window.location.origin}/${currentSlug}/qr`;
    qrCodeUrl = `${window.location.origin}/${currentSlug}/upload`;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <BreadcrumbsNav />

      {/* Header Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Wall Configurations
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Manage display walls for photo submissions via QR codes.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentConfig(null);
            setFormData({
              name: "",
              slug: "",
              mode: "mosaic",
            });
            setIsModalOpen(true);
          }}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            fontWeight: "bold",
            fontSize: "1rem",
            py: 1.5,
          }}
        >
          New Wall Config
        </Button>
      </Stack>

      {/* Divider */}
      <Divider sx={{ mb: 4 }} />

      {/* Grid of Config Cards */}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {wallConfigs.map((config) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={config._id}>
              <Card
                elevation={3}
                sx={{
                  position: "relative",
                  height: "100%",
                  minWidth:"250px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Chip at top-right */}
                <Chip
                  label={config.mode}
                  color={config.mode === "mosaic" ? "primary" : "secondary"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    zIndex: 2,
                  }}
                />

                <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {config.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, wordBreak: "break-word" }}
                  >
                    <strong>Slug:</strong> {config.slug}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(config.createdAt)}
                  </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={{ justifyContent: "space-between", p: 1.5 }}>
                  <Tooltip title="Show QR Code">
                    <IconButton
                      size="small"
                      onClick={() => showQRCode(config.slug)}
                      aria-label="QR Code"
                    >
                      <QrCodeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(config)}
                        aria-label="Edit"
                      >
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setWallToDelete(config);
                          setDeleteDialogOpen(true);
                        }}
                        aria-label="Delete"
                      >
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>
          {currentConfig ? "Edit Wall Config" : "Create New Wall Config"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: "400px",
              }}
            >
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Mode</InputLabel>
                <Select
                  name="mode"
                  value={formData.mode}
                  label="Mode"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="mosaic">mosaic</MenuItem>
                  <MenuItem value="card">card</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentConfig ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* QR Modal */}
      <ShareFeedbackModal
        open={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        slugName={currentSlug}
        shareableLink={uploadUrl}
        qrCodeUrl={qrCodeUrl}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Wall Config?"
        message={`Are you sure you want to permanently delete "${wallToDelete?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
      />
    </Container>
  );
}
