import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import ThemeRegistry from "@/app/styles/themeRegistry";
import { MessageProvider } from "@/app/contexts/MessageContext";
import { AuthProvider } from "@/app/contexts/AuthContext";
import ClientLayout from "@/app/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO
export const metadata = {
  title: "Mosaic Wall | WhiteWall Digital Solutions",
  description:
    "Real-time media display system powered by WhiteWall Digital Solutions.",
  keywords:
    "mosaic wall, digital wall, real-time display, whitewall, whitewall digital solutions, media grid, public uploads",
  author: "WhiteWall Digital Solutions",
};

export const viewport = {
  themeColor: "#033649",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <link rel="icon" href="/WWDS.ico" type="image/png" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <MessageProvider>
              <ClientLayout>{children}</ClientLayout>
            </MessageProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
