"use client";

import Navbar from "@/app/components/Navbar";
import { Box } from "@mui/material";
import { useParams, usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { slug } = useParams();

  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith(`/${slug}/qr`) ||
    pathname.startsWith(`/${slug}/upload`);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Box sx={{ pt: hideNavbar ? 0 : 5 }}>{children}</Box>
    </>
  );
}
