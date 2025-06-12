"use client";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import TvIcon from "@mui/icons-material/Tv";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "blue",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: 4,
          padding: { xs: 3, sm: 5 },
          maxWidth: 500,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 0 30px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ScreenShareIcon />}
            onClick={() => router.push("/auth/login")}
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            User
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<TvIcon />}
            onClick={() => router.push("/cms")}
            sx={{
              backgroundColor: "secondary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "secondary.dark",
              },
            }}
          >
            CMS
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
