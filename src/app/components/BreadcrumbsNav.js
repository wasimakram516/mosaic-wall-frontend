"use client";

import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import UploadIcon from "@mui/icons-material/Upload"; // Import an upload icon

const segmentMap = {
  dashboard: {
    label: "Dashboard",
    icon: <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  walls: {
    label: "Walls",
    icon: <WallpaperIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  upload: {
    label: "Upload",
    icon: <UploadIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  uploads: {
    label: "Uploads",
    icon: <UploadIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatSegment = (seg) => {
  if (segmentMap[seg]) {
    const { icon, label } = segmentMap[seg];
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        <span>{label}</span>
      </Box>
    );
  }
  return capitalize(seg.replace(/-/g, " "));
};

export default function BreadcrumbsNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Filter segments to only include dashboard, wall, and upload/upload
  const segments = pathname
    .split("/")
    .filter((seg) => seg && ["dashboard", "walls", "uploads"].includes(seg));

  const paths = segments.map((seg, i) => ({
    segment: seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            router.push("/cms");
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Dashboard
          </Box>
        </Link>

        {paths.map((p, i) => {
          const segment = formatSegment(p.segment);
          const isLast = i === paths.length - 1;

          return isLast ? (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.primary",
                fontWeight: "bold",
              }}
            >
              {segment}
            </Box>
          ) : (
            <Link
              key={i}
              underline="hover"
              color="inherit"
              href={p.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(p.href);
              }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {segment}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
