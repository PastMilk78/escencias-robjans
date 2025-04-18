import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display, Raleway } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import LoadingOverlay from "./components/LoadingOverlay";
import { AuthProvider } from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: "Escencias Robjans - Fragancias Exclusivas",
  description: "Descubre fragancias exclusivas inspiradas en los mejores perfumes a precios accesibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} ${raleway.variable} font-sans`}>
        <LoadingOverlay />
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
