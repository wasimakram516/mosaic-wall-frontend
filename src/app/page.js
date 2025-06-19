"use client";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Shift } from "ambient-cbg";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Shift />
      {/* Header - WhiteWall Logo */}
      <Box sx={{ mt: 2 }}>
        <Image
          src="/WWDSwhite.png"
          alt="WhiteWall Digital Solutions"
          width={200}
          height={60}
          style={{ objectFit: "contain" }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 600,
          px: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Mosaic Wall CMS
        </Typography>
        <Typography variant="h6" color="grey.300" mb={4}>
          Real-time media display system powered by WhiteWall Digital Solutions.
        </Typography>
        <Button
          size="large"
          variant="contained"
          startIcon={<DashboardIcon />}
          onClick={() => router.push("/cms")}
          sx={{
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Enter CMS
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="body2" color="grey.400">
          © {new Date().getFullYear()} WhiteWall Digital Solutions
        </Typography>
        <Typography variant="body2" color="grey.500">
          Contact:{" "}
          <a href="mailto:solutions@whitewall.om" style={{ color: "#90caf9" }}>
            solutions@whitewall.om
          </a>
        </Typography>
      </Box>
    </Box>
  );
}
