import React, { useRef } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  DialogTitle,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useMessage } from "../contexts/MessageContext";

const ShareFeedbackModal = ({
  open,
  onClose,
  slugName,
  shareableLink,
  qrCodeUrl,
}) => {
  const qrCodeRef = useRef(null);
  const { showMessage } = useMessage();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      showMessage("Link copied to clipboard!", "info");
    } catch (error) {
      showMessage("Failed to copy link.", "error");
    }
  };

  const handleDownloadQRCode = () => {
    const qrCodeCanvas = qrCodeRef.current?.querySelector("canvas");
    if (!qrCodeCanvas) {
      showMessage("QR Code generation failed.", "error");
      return;
    }
    const qrCodeDataURL = qrCodeCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = qrCodeDataURL;
    link.download = "QR-code-for-feedback.png";
    link.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Dialog Title */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          padding: "1.5rem 2rem",
          fontSize: "1.5rem",
          color: "primary.main",
        }}
      >
        Share {slugName}'s Link
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        sx={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            marginBottom: "1.5rem",
            fontSize: "1rem",
          }}
        >
          Use the link or QR code below to display the wall.
        </Typography>

        {/* Shareable Link */}
        <Box
          sx={{
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #ddd",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            value={shareableLink}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "0.95rem",
                color: "#333",
              },
            }}
          />
        </Box>

        {/* Divider */}
        <Divider sx={{ marginBottom: "1.5rem" }} />

        {/* QR Code */}
        <Box
          ref={qrCodeRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <QRCodeCanvas value={qrCodeUrl} size={180} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadQRCode}
            sx={{
              fontSize: "0.9rem",
              borderRadius: "8px",
              textTransform: "none",
              padding: "0.5rem 1.5rem",
            }}
            startIcon={<FileDownloadIcon />}
          >
            Download QR Code
          </Button>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            textTransform: "none",
            fontSize: "0.9rem",
            borderRadius: "8px",
            padding: "0.5rem 1.5rem",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareFeedbackModal;
