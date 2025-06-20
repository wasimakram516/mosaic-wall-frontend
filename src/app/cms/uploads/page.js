"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Paper,
  Skeleton,
  InputAdornment,
  Stack,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Backdrop,
  ToggleButton,
  ToggleButtonGroup,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
  Zoom,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Visibility,
  Clear,
  FilterList,
  Image as ImageIcon,
  AccessTime,
  PhotoLibrary,
  Close,
  ViewModule,
  ViewList,
  Fullscreen,
  ContentCopy,
  Download,
} from "@mui/icons-material";
import { getDisplayMedia } from "@/services/displayMediaService";
import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";

const CMSUploadsPage = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [filters, setFilters] = useState({
    wall: "",
    mode: "",
    search: "",
  });

  // Enhanced fetchMedia function with optional loader control
  const fetchMedia = async (showLoader = true) => {
    try {
      console.log("🔄 Fetching media data...", { showLoader });
      if (showLoader) setLoading(true);
      const response = await getDisplayMedia();
      console.log("✅ Display media received:", response);
      const mediaData = response.data;

      setMedia(mediaData);
      setFilteredMedia(mediaData);
      if (showLoader) setLoading(false);

      console.log("📊 Media state updated with", mediaData.length, "items");
    } catch (error) {
      console.error("❌ Error fetching media:", error);

      if (showLoader) setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMedia();
  }, []);

  // Filter media based on current filters
  useEffect(() => {
    let filtered = media;

    if (filters.wall) {
      filtered = filtered.filter((item) => item.wall._id === filters.wall);
    }

    if (filters.mode) {
      filtered = filtered.filter((item) => item.wall.mode === filters.mode);
    }

    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.text.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.wall.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredMedia(filtered);
  }, [filters, media]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ wall: "", mode: "", search: "" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUniqueWalls = () => {
    const walls = media.map((item) => item.wall);
    return walls.filter(
      (wall, index, self) => index === self.findIndex((w) => w._id === wall._id)
    );
  };

  const handleView = (item) => {
    setSelectedMedia(item);
    setModalOpen(true);
  };

  const handlePreview = (item) => {
    setSelectedMedia(item);
    setPreviewOpen(true);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handleDownload = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `media-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setSelectedMedia(null);
  };

  // Modal Component
  const MediaModal = ({ open, media, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      {media && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" component="div">
                {media.wall.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={media.wall.mode.toUpperCase()}
                  size="small"
                  color={media.wall.mode === "card" ? "primary" : "secondary"}
                />
                <IconButton onClick={onClose} size="small">
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box position="relative">
                <img
                  src={media.imageUrl}
                  alt="Media preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                  onClick={() => handlePreview(media)}
                >
                  <Fullscreen />
                </IconButton>
              </Box>

              {media.wall.mode === "card" && media.text && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Text Content
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {media.text}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {formatDate(media.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Wall Mode:</strong> {media.wall.mode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      <strong>Image URL:</strong> {media.imageUrl}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              startIcon={<ContentCopy />}
              onClick={() => handleCopyUrl(media.imageUrl)}
              size="small"
            >
              Copy URL
            </Button>
            <Button
              startIcon={<Download />}
              onClick={() =>
                handleDownload(media.imageUrl, `media-${media._id}`)
              }
              size="small"
            >
              Download
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  // Full Screen Preview Component
  const FullScreenPreview = ({ open, media, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      TransitionComponent={Zoom}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: "rgba(0,0,0,0.9)",
        },
      }}
    >
      {media && (
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          position="relative"
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              zIndex: 1,
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            <Close />
          </IconButton>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex={1}
            p={2}
          >
            <img
              src={media.imageUrl}
              alt="Full screen preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Paper
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
              p: 2,
              bgcolor: "rgba(255,255,255,0.95)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {media.wall.name}
            </Typography>
            {media.wall.mode === "card" && media.text && (
              <Typography variant="body2" color="text.secondary">
                {media.text}
              </Typography>
            )}
          </Paper>
        </Box>
      )}
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Skeleton variant="text" width={300} height={60} />
          <Skeleton variant="text" width={500} height={30} />
        </Box>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Skeleton variant="rectangular" width={300} height={56} />
            <Skeleton variant="rectangular" width={200} height={56} />
            <Skeleton variant="rectangular" width={150} height={56} />
          </Stack>
        </Paper>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <BreadcrumbsNav />
      {/* Header */}
      <Box mb={4}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography variant="h3" color="text.primary" gutterBottom>
              Media Gallery
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View all uploaded media across display walls
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {/* Search */}
          <TextField
            placeholder="Search by text or wall name..."
            variant="outlined"
            size="small"
            sx={{ minWidth: 300, flexGrow: 1 }}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          {/* Wall Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Wall</InputLabel>
            <Select
              value={filters.wall}
              label="Wall"
              onChange={(e) => handleFilterChange("wall", e.target.value)}
            >
              <MenuItem value="">
                <em>All Walls</em>
              </MenuItem>
              {getUniqueWalls().map((wall) => (
                <MenuItem key={wall._id} value={wall._id}>
                  {wall.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Mode Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Mode</InputLabel>
            <Select
              value={filters.mode}
              label="Mode"
              onChange={(e) => handleFilterChange("mode", e.target.value)}
            >
              <MenuItem value="">
                <em>All Modes</em>
              </MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="mosaic">Mosaic</MenuItem>
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="card" aria-label="card view">
              <Tooltip title="Card View">
                <ViewList />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <Tooltip title="Grid View">
                <ViewModule />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Clear Filters */}
          {(filters.wall || filters.mode || filters.search) && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Clear />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </Stack>
      </Paper>
      {/* Results Count */}
      <Box mb={3}>
        <Typography
          component="div"
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <PhotoLibrary fontSize="small" />
          Showing {filteredMedia.length} of {media.length} media items
        </Typography>
      </Box>
      {/* Media Display */}
      {filteredMedia.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: "center" }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              bgcolor: "grey.200",
            }}
          >
            <ImageIcon sx={{ fontSize: 32, color: "grey.500" }} />
          </Avatar>
          <Typography variant="h6" color="text.primary" gutterBottom>
            No media found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.wall || filters.mode || filters.search
              ? "Try adjusting your filters to see more results."
              : "No media available to display."}
          </Typography>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View
        <Grid container spacing={3}>
          {filteredMedia.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                elevation={2}
                sx={{
                  height: "95%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    elevation: 8,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt="Media preview"
                  sx={{
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePreview(item)}
                />
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  {/* Wall Info */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography
                      variant="h6"
                      color="text.primary"
                      noWrap
                      sx={{ flexGrow: 1, mr: 1 }}
                    >
                      {item.wall.name}
                    </Typography>
                    <Chip
                      label={item.wall.mode.toUpperCase()}
                      size="small"
                      color={
                        item.wall.mode === "card" ? "primary" : "secondary"
                      }
                      variant="outlined"
                    />
                  </Box>

                  {/* Text Content (for card mode) */}
                  {item.wall.mode === "card" && (
                    <Box mb={2}>
                      {item.text ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                            minHeight: "4.2em",
                          }}
                        >
                          {item.text}
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          fontStyle="italic"
                        >
                          No text content
                        </Typography>
                      )}
                    </Box>
                  )}

                  {/* Timestamp */}
                  <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Actions */}
                  <Box display="flex" justifyContent="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleView(item)}
                      aria-label="View media details"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Grid View
        <ImageList variant="masonry" cols={4} gap={16}>
          {filteredMedia.map((item) => (
            <ImageListItem key={item._id}>
              <img
                src={item.imageUrl}
                alt="Media preview"
                loading="lazy"
                style={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "transform 0.2s",
                }}
                onClick={() => handlePreview(item)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              />
              <ImageListItemBar
                title={item.wall.name}
                subtitle={formatDate(item.createdAt)}
                actionIcon={
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item);
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                }
                sx={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      {/* Modal and Preview Components */}
      <MediaModal open={modalOpen} media={selectedMedia} onClose={closeModal} />
      <FullScreenPreview
        open={previewOpen}
        media={selectedMedia}
        onClose={closePreview}
      />
    </Container>
  );
};

export default CMSUploadsPage;
