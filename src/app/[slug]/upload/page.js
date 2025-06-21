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
import { uploadPhoto } from "@/services/displayMediaService";
import { getWallConfigBySlug } from "@/services/wallConfigService";
import EXIF from "exif-js";

export default function UploadPage() {
  const { slug } = useParams();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const loadWallConfigs = async () => {
      try {
        const response = await getWallConfigBySlug(slug);
        const wallConfig = response.data;
        setMode(wallConfig.mode);
      } catch (err) {
        console.error("Failed to load wall config:", err);
      }
    };

    loadWallConfigs();
  }, [slug]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError("");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      setCameraOn(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      setError("Failed to access camera. Please allow camera permissions.");
      console.error("Camera error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraOn(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
  
      const vw = video.videoWidth;
      const vh = video.videoHeight;
  
      const isPortrait = vh > vw;
  
      // 1. Draw normal video frame to temp canvas
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = vw;
      tempCanvas.height = vh;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(video, 0, 0, vw, vh);
  
      // 2. Rotate to portrait if needed (landscape case)
      if (!isPortrait) {
        canvas.width = vh; // rotated width
        canvas.height = vw; // rotated height
        ctx.save();
        ctx.translate(vh / 2, vw / 2); // center
        ctx.rotate(Math.PI / 2); // 90 degrees
        ctx.drawImage(tempCanvas, -vw / 2, -vh / 2);
        ctx.restore();
      } else {
        canvas.width = vw;
        canvas.height = vh;
        ctx.drawImage(tempCanvas, 0, 0);
      }
  
      // 3. Convert to blob
      canvas.toBlob((blob) => {
        setCapturedImage(blob);
        stopCamera();
      }, "image/jpeg", 0.8);
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
      </Box>

      {/* Title and Mode */}
      <Box sx={{ textAlign: "center", my: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Capture Your Photo
        </Typography>
        {mode ? (
          <Chip
            label={`${mode} mode`}
            color={mode === "mosaic" ? "primary" : "secondary"}
            sx={{ textTransform: "capitalize" }}
          />
        ) : (
          <CircularProgress size={24} />
        )}
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

      {/* Camera Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        {!cameraOn ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startCamera}
            startIcon={<CameraIcon />}
            disabled={isLoading}
            sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
          >
            {isLoading ? "Accessing Camera..." : "Start Camera"}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={stopCamera}
            sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
          >
            Stop Camera
          </Button>
        )}
      </Box>

      {/* Live Camera Feed */}
      {cameraOn && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ position: "relative", mb: 2 }}>
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.6)",
                  borderRadius: 2,
                  zIndex: 2,
                }}
              >
                <Box sx={{ textAlign: "center", color: "white" }}>
                  <CircularProgress size={32} sx={{ mb: 1 }} />
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
                borderRadius: "12px",
                backgroundColor: "#000",
              }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </Box>
        </Paper>
      )}

      {/* Preview */}
      {capturedImage && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Preview
          </Typography>
          <img
            src={URL.createObjectURL(capturedImage)}
            alt="Captured"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        </Paper>
      )}

      {/* Optional Text */}
      {mode === "card" && capturedImage && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Add a Message
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message (shown on the big screen)..."
            variant="outlined"
            inputProps={{ maxLength: 200 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block", textAlign: "right" }}
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
            color="primary"
            onClick={capturePhoto}
            disabled={isLoading || !cameraOn}
            startIcon={<CameraIcon />}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            Capture Photo
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={submitPhoto}
              disabled={isSubmitting || (mode === "card" && !text.trim())}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              sx={{ py: 1.5, fontWeight: "bold" }}
            >
              {isSubmitting
                ? "Uploading..."
                : `Submit ${mode === "card" ? "Photo & Message" : "Photo"}`}
            </Button>

            <Button
              variant="outlined"
              size="large"
              color="warning"
              onClick={retakePhoto}
              disabled={isSubmitting}
              startIcon={<RefreshIcon />}
              sx={{ py: 1.5, fontWeight: "bold" }}
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
        {mode ? (
          <Typography variant="body2" color="text.secondary">
            {mode === "mosaic"
              ? "Take a photo and submit it. Your photo will appear on the big screen in the live mosaic."
              : "Take a photo and add a message. Both your image and message will be shown on the big screen."}
          </Typography>
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 50,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>
    </Container>
  );
}
