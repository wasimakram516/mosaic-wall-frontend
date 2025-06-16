"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getWallConfigs,
  createWallConfig,
  updateWallConfig,
  deleteWallConfig,
} from "@/services/wallConfigService";
import { format } from "date-fns";
import QRCodeDisplay from "@/app/components/QRCodeDisplay";
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
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";

export default function WallConfigsPage() {
  const router = useRouter();
  const [wallConfigs, setWallConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState("");
  const [currentConfig, setCurrentConfig] = useState(null);

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
      console.log("Fetched wall configs:", response);
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
        console.log(formData);
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

  const handleDelete = async (id) => {
    try {
      await deleteWallConfig(id);
      fetchWallConfigs();
    } catch (error) {
      console.error("Failed to delete wall config:", error);
    }
  };

  const showQRCode = (slug) => {
    setCurrentSlug(slug);
    setIsQRModalOpen(true);
  };

  let uploadUrl = "";
  if (typeof window !== "undefined") {
    uploadUrl = `${window.location.origin}/upload/${currentSlug}`;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Wall Configurations
        </Typography>
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
        >
          New Wall Config
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {wallConfigs.map((config) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={config._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {config.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Slug:</strong> {config.slug}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={config.mode}
                      color={
                        config.mode === "mosaic"
                          ? "primary"
                          : config.mode === "card"
                          ? "secondary"
                          : "default"
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Created: {format(new Date(config.createdAt), "PPpp")}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => showQRCode(config.slug)}
                    aria-label="Show QR Code"
                  >
                    <QrCodeIcon />
                  </IconButton>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(config)}
                      aria-label="Edit"
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(config._id)}
                      aria-label="Delete"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Wall Config Form Modal */}
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
                margin="normal"
              />
              <TextField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
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

      {/* QR Code Modal */}
      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onClose={() => setIsQRModalOpen(false)}>
        <DialogTitle>QR Code for {currentSlug}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 1,
                minWidth: 300,
                minHeight: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <QRCodeDisplay value={uploadUrl} />
            </Box>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
              {uploadUrl}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                const canvas = document.querySelector("canvas");
                if (canvas) {
                  const link = document.createElement("a");
                  link.download = `wall-config-${currentSlug}.png`;
                  link.href = canvas.toDataURL("image/png");
                  link.click();
                }
              }}
            >
              Download QR Code
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQRModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
