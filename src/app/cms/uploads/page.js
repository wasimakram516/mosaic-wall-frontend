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
  Tooltip,
  Zoom,
} from "@mui/material";
import {
  Search,
  Visibility,
  Clear,
  Image as ImageIcon,
  AccessTime,
  PhotoLibrary,
  Close,
  Delete,
} from "@mui/icons-material";
import {
  getDisplayMedia,
  deleteDisplayMedia,
} from "@/services/displayMediaService";

import BreadcrumbsNav from "@/app/components/BreadcrumbsNav";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import { formatDate } from "@/utils/dateUtils";

const CMSUploadsPage = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

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

  const getUniqueWalls = () => {
    const walls = media.map((item) => item.wall);
    return walls.filter(
      (wall, index, self) => index === self.findIndex((w) => w._id === wall._id)
    );
  };

  const handlePreview = (item) => {
    setSelectedMedia(item);
    setPreviewOpen(true);
  };

  const handleDeleteClick = (item) => {
    setMediaToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!mediaToDelete) return;
    try {
      await deleteDisplayMedia(mediaToDelete._id);
      setDeleteDialogOpen(false);
      setMediaToDelete(null);
      fetchMedia(false);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setSelectedMedia(null);
  };

  const FullScreenPreview = ({ open, media, onClose }) => (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Zoom}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#000", // clean black background
        },
      }}
    >
      {media && (
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          height="100vh"
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
            }}
          >
            <Close />
          </IconButton>

          {/* Image Display */}
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={2}
            py={4}
          >
            <Box
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 5,
              }}
            >
              <img
                src={media.imageUrl}
                alt="Full screen preview"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>

          {/* Caption Section */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              px: 4,
              py: 3,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent)",
              color: "white",
            }}
          >
            <Typography variant="subtitle2" color="grey.400" gutterBottom>
              Uploaded via{" "}
              {media.wall.mode === "card" ? "Card Wall" : "Mosaic Wall"}
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ textTransform: "capitalize" }}
            >
              {media.wall.name}
            </Typography>

            {media.wall.mode === "card" && media.text && (
              <Typography
                variant="body1"
                color="grey.200"
                sx={{
                  mt: 1,
                  whiteSpace: "pre-wrap",
                  maxWidth: "250px",
                }}
              >
                {media.text}
              </Typography>
            )}
            <Typography variant="caption" color="grey.500" mt={1}>
              {formatDate(media.createdAt)}
            </Typography>
          </Box>
        </Box>
      )}
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
        {/* Title Skeletons */}
        <Box mb={4}>
          <Skeleton variant="text" sx={{ width: "30%", height: 50 }} />
          <Skeleton variant="text" sx={{ width: "50%", height: 25 }} />
        </Box>
  
        {/* Filters Skeleton */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Skeleton variant="rectangular" sx={{ width: { xs: "100%", sm: 300 }, height: 56 }} />
            <Skeleton variant="rectangular" sx={{ width: { xs: "100%", sm: 200 }, height: 56 }} />
            <Skeleton variant="rectangular" sx={{ width: { xs: "100%", sm: 150 }, height: 56 }} />
          </Stack>
        </Paper>
  
        {/* Grid Skeleton */}
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Media Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            View and manage all submitted media from your display walls.
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Filter Your Media
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the search and dropdowns below to find media by wall, mode, or
            keywords.
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
          useFlexGap
        >
          {/* Search on the left */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by wall name or text..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            sx={{ width: { xs: "100%", sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Filters on the right */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
            flexWrap="wrap"
            useFlexGap
          >
            {/* Wall Selector */}
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 160 } }}>
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

            {/* Mode Selector */}
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 160 } }}>
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

            {/* Clear Button */}
            {(filters.wall || filters.mode || filters.search) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Clear />}
                onClick={clearFilters}
                sx={{ whiteSpace: "nowrap", height: 40 }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
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
      ) : (
        <Grid container spacing={3}>
          {filteredMedia.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id} sx={{ display: "flex" }}>
            <Card
              elevation={2}
              sx={{
                width: "300px",
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "0.3s ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt="Media"
                  sx={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => handlePreview(item)}
                />

                {/* Top-right mode chip */}
                <Chip
                  label={item.wall.mode.toUpperCase()}
                  size="small"
                  color={item.wall.mode === "card" ? "primary" : "secondary"}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    fontWeight: "bold",
                  }}
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ wordBreak: "break-word", mb: 1 }}
                  >
                    {item.wall.name}
                  </Typography>

                  {item.wall.mode === "card" && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.text || (
                        <em style={{ color: "#888" }}>No message provided</em>
                      )}
                    </Typography>
                  )}

                  <Box flexGrow={1} />

                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.createdAt)}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 1 }} />

                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handlePreview(item)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <FullScreenPreview
        open={previewOpen}
        media={selectedMedia}
        onClose={closePreview}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Media?"
        message="Are you sure you want to permanently delete this media item? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </Container>
  );
};

export default CMSUploadsPage;
