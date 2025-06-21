"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useMediaSocket from "@/hooks/useMediaSocket";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import { getWallConfigBySlug } from "@/services/wallConfigService";
import MosaicGrid from "@/app/components/MosaicGrid";
import CardsGrid from "@/app/components/CardsGrid";
import { Shift } from "ambient-cbg";

const BigScreenPage = () => {
  const { slug } = useParams();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null);

  const { connected, connectionError } = useMediaSocket({
    wallSlug: slug,
    onMediaUpdate: (data) => {
      setMedia(data);
      setLoading(false);
    },
  });

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
    setLoading(true);
  }, [slug]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!connected) {
    return (
      <Container>
        <Typography variant="body2" color="error" mt={2}>
          Socket not connected{connectionError ? `: ${connectionError}` : ""}
        </Typography>
      </Container>
    );
  }

  if (!media.length) {
    return (
      <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{position:"relative"}}
    >
              <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
                      <Shift />
                    </Box>
              <Typography variant="h6" textAlign="center" mt={4} zIndex={1}>
          No media available yet.
        </Typography>
    </Box>
    );
  }

  // 🔷 M O S A I C   M O D E
  if (mode === "mosaic") {
    return <MosaicGrid media={media} />;
  }

  // 🔷 C A R D   M O D E
  if (mode === "card") {
    return <CardsGrid media={media} />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default BigScreenPage;
