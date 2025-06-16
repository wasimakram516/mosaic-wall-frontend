"use client";
import { useEffect, useRef } from "react";

export default function QRCodeDisplay({ value }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    // Dynamic import of qrcode library
    import("qrcode")
      .then((QRCode) => {
        QRCode.toCanvas(canvasRef.current, value, {
          width: 256,
          margin: 2,
          errorCorrectionLevel: "H",
        });
      })
      .catch((error) => {
        console.error("Failed to generate QR code:", error);
      });
  }, [value]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
}
