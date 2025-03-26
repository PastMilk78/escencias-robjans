import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Escencias Robjan's | Tienda de Perfumes",
  description: "Tienda online de perfumes exclusivos",
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
