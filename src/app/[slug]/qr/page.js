"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import { getWallConfigBySlug } from "@/services/wallConfigService";

export default function PublicQrPage() {
  const { slug } = useParams();
  const [askPageUrl, setAskPageUrl] = useState("");
  const [wallConfig, setWallConfig] = useState(null);
  useEffect(() => {
    const fetchWallConfig = async () => {
      if (slug) {
        try {
          const response = await getWallConfigBySlug(slug);
          setWallConfig(response.data);

          if (typeof window !== "undefined") {
            // Include mode in the URL so the upload page knows what mode to use
            setAskPageUrl(
              `${window.location.origin}/${slug}/upload?mode=${response.data.mode}`
            );
          }
        } catch (error) {
          console.error("Failed to fetch wall config:", error);
        }
      }
    };

    fetchWallConfig();
  }, [slug]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 10,
        textAlign: "center",
      }}
    >
      {/* ✅ Sticky Branding */}
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

      {/* ✅ Heading */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
        Scan to Capture your photo
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use your phone to scan this QR code and capture your photo.
      </Typography>

      {/* ✅ QR Code or Loader */}
      {askPageUrl ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: 3,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <QRCodeCanvas
            value={askPageUrl}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H" // High error correction
            includeMargin={false}
          />
        </Box>
      ) : (
        <CircularProgress sx={{ mt: 4 }} />
      )}

      {/* ✅ Footer */}
      <Typography variant="caption" color="text.secondary" mt={3}>
        Powered by WhiteWall Digital Solutions
      </Typography>
    </Container>
  );
}
