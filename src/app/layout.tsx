import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  variable: "--font-fraunces",
  src: [
    {
      path: "./fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "./fonts/Fraunces-Italic-VariableFont_SOFT,WONK,opsz,wght.ttf",
      weight: "300 900",
      style: "italic",
    },
  ],
  display: "swap",
});

const cormorant = localFont({
  variable: "--font-cormorant",
  src: [
    {
      path: "./fonts/CormorantGaramond-VariableFont_wght.ttf",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "./fonts/CormorantGaramond-Italic-VariableFont_wght.ttf",
      weight: "300 700",
      style: "italic",
    },
  ],
  display: "swap",
});

const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  src: [
    {
      path: "./fonts/JetBrainsMono-VariableFont_wght.ttf",
      weight: "100 800",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono-Italic-VariableFont_wght.ttf",
      weight: "100 800",
      style: "italic",
    },
  ],
  display: "swap",
});

const notoNaskhArabic = localFont({
  variable: "--font-noto-naskh-arabic",
  src: "./fonts/NotoNaskhArabic-VariableFont_wght.ttf",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lebanese Academic",
  description:
    "A literary-political publication on Lebanon, memory, power, and public life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${notoNaskhArabic.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
