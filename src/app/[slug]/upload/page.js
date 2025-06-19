"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { uploadPhoto } from "@/services/displayMediaService"; // Import the service

export default function UploadPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "mosaic";

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Front camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      setError("Failed to access camera. Please allow camera permissions.");
      console.error("Camera error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          setCapturedImage(blob);
        },
        "image/jpeg",
        0.8
      );
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setText("");
    setError("");
  };

  const submitPhoto = async () => {
    if (!capturedImage) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Use the service function instead of direct fetch
      const result = await uploadPhoto(
        slug,
        capturedImage,
        mode === "card" ? text.trim() : "",
        mode
      );

      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setCapturedImage(null);
        setText("");
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Failed to upload photo. Please try again."
      );
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", py: 2 }}>
      {/* Header with Branding */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          bgcolor: "background.default",
          zIndex: 10,
          py: 1,
          px: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ width: { xs: 35, sm: 40 } }}>
          <Image
            src="/WW.png"
            alt="WhiteWall Logo"
            width={100}
            height={30}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ bgcolor: "grey.400", height: 30, mx: 2 }}
        />
      </Box>

      {/* Title and Mode */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Capture Your Photo
        </Typography>
        <Chip
          label={`${mode} mode`}
          color={mode === "mosaic" ? "primary" : "secondary"}
          sx={{ textTransform: "capitalize" }}
        />
      </Box>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Photo uploaded successfully! You can take another photo.
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Camera Section */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ position: "relative", mb: 2 }}>
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.7)",
                zIndex: 1,
                borderRadius: 1,
              }}
            >
              <Box sx={{ textAlign: "center", color: "white" }}>
                <CircularProgress size={32} sx={{ color: "white", mb: 1 }} />
                <Typography variant="body2">Starting camera...</Typography>
              </Box>
            </Box>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              backgroundColor: "#000",
            }}
          />

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </Box>
      </Paper>

      {/* Captured Image Preview */}
      {capturedImage && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preview:
          </Typography>
          <img
            src={URL.createObjectURL(capturedImage)}
            alt="Captured"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Paper>
      )}

      {/* Text Input for Card Mode */}
      {mode === "card" && capturedImage && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add a message:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your message here..."
            variant="outlined"
            inputProps={{ maxLength: 200 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            {text.length}/200 characters
          </Typography>
        </Paper>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {!capturedImage ? (
          <Button
            variant="contained"
            size="large"
            onClick={capturePhoto}
            disabled={isLoading}
            startIcon={<CameraIcon />}
            fullWidth
          >
            Capture Photo
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              size="large"
              onClick={submitPhoto}
              disabled={isSubmitting || (mode === "card" && !text.trim())}
              startIcon={
                isSubmitting ? <CircularProgress size={16} /> : <SendIcon />
              }
              fullWidth
            >
              {isSubmitting
                ? "Uploading..."
                : `Submit ${mode === "card" ? "Photo & Message" : "Photo"}`}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={retakePhoto}
              disabled={isSubmitting}
              startIcon={<RefreshIcon />}
              fullWidth
            >
              Retake Photo
            </Button>
          </>
        )}
      </Box>

      {/* Instructions */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: "grey.50" }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {mode === "mosaic"
            ? "Take a photo and submit it directly. Your photo will be added to the collection."
            : "Take a photo and add a message. Both will be saved together."}
        </Typography>
      </Paper>
    </Container>
  );
}
