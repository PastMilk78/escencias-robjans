import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Escencias Robjan&apos;s | Tienda de Perfumes",
  description: "Encuentra fragancias exclusivas inspiradas en los mejores perfumes del mercado a precios accesibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${raleway.variable} font-raleway antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
